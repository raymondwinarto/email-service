const SendGridMail = require('../../lib/mails/send-grid-mail');

const handlers = {
  async sendEmail(request, h) {
    const { payload } = request;

    const sendGridMail = new SendGridMail(payload);
    const response = await sendGridMail.send();

    return h.response(response ? { sent: true } : { sent: false }).code(201);
  },
};

module.exports = handlers;
