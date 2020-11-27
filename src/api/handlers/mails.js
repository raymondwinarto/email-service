const handlers = {
  async sendEmail(request, h) {
    const { payload, MailProviders } = request;

    const providers = MailProviders.map((Service) => ({ Service, success: false }));

    // https://stackoverflow.com/questions/41243468/javascript-array-reduce-with-async-await
    const providersResponse = providers.reduce(async (accumP, provider) => {
      const accum = await accumP;
      if (accum.find((pr) => pr.response)) {
        // there is a successful response, just return
        return [...accum, { Service: provider.Service }];
      }

      try {
        const mailProvider = new provider.Service(payload);
        const response = await mailProvider.send();

        const result = [...accum, { Service: provider.Service, response }];
        return result;
      } catch (error) {
        request.logger.error(error);
        return [...accum, { Service: provider.Service, error }];
      }
    }, Promise.resolve([]));

    // get the response
    const rsp = await providersResponse;
    const succesfulProvider = rsp.find((pr) => pr.response);
    const response = succesfulProvider && succesfulProvider.response;

    // set the new active provider
    const newMailProviders = rsp.sort((a) => (a.response ? -1 : 0)).map((pr) => pr.Service);
    request.MailProviders = newMailProviders;

    return h.response(response ? { sent: true } : { sent: false }).code(201);
  },
};

module.exports = handlers;
