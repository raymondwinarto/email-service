const SendGrid = require('../../lib/mails/send-grid');
const MailGunMail = require('../../lib/mails/mail-gun');

const handlers = {
  async sendEmail(request, h) {
    const { payload } = request;

    // const sendGrid = new SendGrid(payload);
    // const response = await sendGrid.send();

    const mailGunMail = new MailGunMail(payload);
    const response = await mailGunMail.send();

    return h.response(response ? { sent: true } : { sent: false }).code(201);
  },
};

module.exports = handlers;
