const handlers = {
  async sendEmail(request, h) {
    const { payload, mailProviders } = request;

    const mailProvider = new mailProviders[0].Service(payload);
    const response = await mailProvider.send();

    return h.response(response ? { sent: true } : { sent: false }).code(201);
  },
};

module.exports = handlers;
