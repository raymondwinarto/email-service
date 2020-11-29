const axios = require('axios');

const MailProvider = require('./mail-provider');

const { SENDGRID_API_KEY, SENDGRID_API_BASE_URL } = process.env;

const axiosInstance = axios.create({
  baseURL: SENDGRID_API_BASE_URL,
  timeout: 20000,
  headers: {
    Authorization: `Bearer ${SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

class SendGrid extends MailProvider {
  async send() {
    const to = this.tos.map((email) => ({ email }));
    const cc = this.ccs && this.ccs.map((email) => ({ email }));
    const bcc = this.bccs && this.bccs.map((email) => ({ email }));
    // TODO: cc and bcc

    const response = await axiosInstance.post('/v3/mail/send', {
      personalizations: [
        {
          to,
          cc,
          bcc,
        },
      ],
      from: {
        email: this.from,
      },
      subject: this.subject,
      content: [
        {
          type: 'text/plain',
          value: this.content,
        },
      ],
    });

    // 200 OK - Valid message but not queued (can only happened in Sandbox mode)
    // 204 ACCEPTED - Valid message and queued to be delivered
    if (response.status === 202) return { status: 'queued' };

    this.logger.warn('Email is valid but not queued in Sandgrid (Sandbox mode)');
    return { status: 'ok' };
  }
}

module.exports = SendGrid;
