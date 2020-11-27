const handlers = {
  async sendEmail(request, h) {
    const { payload, MailProviders } = request;

    // const providers = [...mailProviders].map(({ Service }) => ({ Service, active: false }));

    // const providerSents = providers.reduce(
    //   async (accum, provider) => {
    //     const mailProvider = new mailProviders[0].Service(payload);
    //     const response = await mailProvider.send();
    //   },
    //   [...providers]
    // );

    // // get the response
    // const succesfulProvider = providerSents.find((sent) => sent.response);
    // const response = succesfulProvider && succesfulProvider.response;

    // // set the new active provider

    const mailProvider = new MailProviders[0](payload);
    const response = await mailProvider.send();

    return h.response(response ? { sent: true } : { sent: false }).code(201);
  },
};

module.exports = handlers;
