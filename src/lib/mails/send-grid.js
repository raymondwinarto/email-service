const axios = require('axios');

const MailProvider = require('./mail-provider');
const { HTTP_ACCEPTED_CODE, ERRORS } = require('../../constants');

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
    if (!this.isTotalRecipientsAllowed) {
      throw new Error(ERRORS.RECIPIENT_LIMIT);
    }

    const to = this.tos.map((email) => ({ email }));
    const cc = this.ccs.map((email) => ({ email }));
    const bcc = this.bccs.map((email) => ({ email }));

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

    // 202 ACCEPTED - valid message and queued to be delivered
    if (response.status === HTTP_ACCEPTED_CODE) return response;

    // SendGrid may return 200 OK for valid message but not queued (which is only possible
    // in Sandbox mode) - in this case we consider that email is not going to be delivered
    throw new Error(ERRORS.EMAIL_NOT_QUEUED);
  }
}

module.exports = SendGrid;
