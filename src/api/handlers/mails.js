const Boom = require('@hapi/boom');

const { SEND_QUEUED_STATUS, HTTP_ACCEPTED_CODE, ERRORS } = require('../../constants');

const handlers = {
  async sendEmail(request, h) {
    const { payload, server, logger } = request;
    const { MailProviders } = server;

    let response;
    let successfulProvider;

    // airbnb eslint disallow await inside "for loop"
    // from research - it seems very rare for us needing to do sequential
    // async/await loop - often we can go with await Promise.all
    // of the await Promise call and use filter/reduce against
    // the result not the promises
    // see https://zellwk.com/blog/async-await-in-loops/ - "Key Takeways" section at the end

    // eslint-disable-next-line no-restricted-syntax
    for (const MailProvider of MailProviders) {
      try {
        const mailProvider = new MailProvider(payload, logger);

        // eslint-disable-next-line no-await-in-loop
        response = await mailProvider.send();
        successfulProvider = MailProvider;
        break;
      } catch (error) {
        if (error.message === ERRORS.RECIPIENT_LIMIT) {
          throw Boom.badRequest(ERRORS.RECIPIENT_LIMIT);
        }

        logger.error(ERRORS.POSTING_REQUEST);
        logger.error(error);
      }
    }

    if (!response) {
      // Error can be due to
      // - non 2XX status code was returned by Mail Provider
      // - or Request was sent but no response was received from Mail Provider
      // - or config error such as invalid API_KEY
      // however, we don't want to expose the error details to the API
      // consumer - have logged the error in the above catch block
      throw Boom.serverUnavailable(ERRORS.MAIL_PROVIDER_UNAVAILABLE);
    }

    // We use the order of item in the MailProviders array to determine
    // which mail provider will be used first - so here we put the last successful
    // mail provider first in the array for the next request
    request.server.MailProviders = [
      successfulProvider,
      ...MailProviders.filter((mailProvider) => mailProvider !== successfulProvider),
    ];

    return h.response({ status: SEND_QUEUED_STATUS }).code(HTTP_ACCEPTED_CODE);
  },
};

module.exports = handlers;
