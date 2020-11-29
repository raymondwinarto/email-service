const axios = require('axios');

const MailProvider = require('./mail-provider');
const { SEND_OK_STATUS, SEND_QUEUED_STATUS, HTTP_ACCEPTED_CODE } = require('../../constants');

const { SENDGRID_API_KEY, SENDGRID_API_BASE_URL } = process.env;

const axiosInstance = axios.create({
  baseURL: SENDGRID_API_BASE_URL,
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

    // 200 OK - valid message but not queued (can only happened in Sandbox mode)
    // 202 ACCEPTED - valid message and queued to be delivered
    if (response.status === HTTP_ACCEPTED_CODE) return { status: SEND_QUEUED_STATUS };

    this.logger.warn('Email is valid but not queued in SandGrid (Sandbox mode).');
    return { status: SEND_OK_STATUS };
  }
}

module.exports = SendGrid;
