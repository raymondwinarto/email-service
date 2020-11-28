const Boom = require('@hapi/boom');

const handlers = {
  async sendEmail(request, h) {
    const { payload, server } = request;
    const { MailProviders } = server;

    let response;
    const nextMailProviders = [];

    // airbnb eslint disallow us to do an await inside for loop
    // from research - it seems very rare for us needing to do sequential
    // async/await loop - often we can go with await Promise.all
    // of the await Promise call and use filter/reduce against
    // the result not the promises
    // see https://zellwk.com/blog/async-await-in-loops/ - Key Takeways section at the end

    // eslint-disable-next-line no-restricted-syntax
    for (const MailProvider of MailProviders) {
      if (response) {
        // we have a successful call to one of the mailProvider - just add to the array
        nextMailProviders.push({ MailProvider, success: false });
      } else {
        try {
          const mailProvider = new MailProvider(payload, request.logger);
          // eslint-disable-next-line no-await-in-loop
          response = await mailProvider.send();

          nextMailProviders.push({ MailProvider, success: true });
        } catch (error) {
          request.logger.error('Error posting request to Mail Provider');
          request.logger.error(error);
          nextMailProviders.push({ MailProvider, success: false });
        }
      }
    }

    if (!response) {
      // Error can be due to
      // - non 2XX status code was returned by Mail Provider
      // - or Request was sent but no response was received from Mail Provider
      // - or config error such as invalid API_KEY
      // however, we don't want to expose the error details to the API
      // consumer - have logged the error in the above catch block
      throw Boom.serverUnavailable('Mail Provider Service Unavailable');
    }

    // We use the order of item in the MailProviders array to determine
    // which mail provider will be used first - so here we sort the array
    // by the last successful provider
    request.server.MailProviders = nextMailProviders
      .sort((a) => (a.success ? -1 : 0))
      .map((mailProvider) => mailProvider.MailProvider);

    return h.response(response).code(201);
  },
};

module.exports = handlers;
