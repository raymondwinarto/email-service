const axios = require('axios');
const FormData = require('form-data');

const MailProvider = require('./mail-provider');
const { SEND_OK_STATUS, SEND_QUEUED_STATUS, HTTP_OK_CODE } = require('../../constants');

const { MAILGUN_API_KEY, MAILGUN_API_BASE_URL } = process.env;

const axiosInstance = axios.create({
  baseURL: MAILGUN_API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  auth: {
    username: 'api',
    password: MAILGUN_API_KEY,
  },
});

class MailGun extends MailProvider {
  async send() {
    const form = new FormData();

    form.append('from', this.from);
    form.append('subject', this.subject);
    form.append('text', this.content);

    this.tos.forEach((email) => {
      form.append('to', email);
    });

    if (this.ccs) {
      this.ccs.forEach((email) => {
        form.append('cc', email);
      });
    }

    if (this.bccs) {
      this.bccs.forEach((email) => {
        form.append('bcc', email);
      });
    }

    const response = await axiosInstance.post('/messages', form, { headers: form.getHeaders() });

    if (response.status === HTTP_OK_CODE) return { status: SEND_QUEUED_STATUS };

    // MailGun only specifies one 2XX code which is 200 and we want to be sure
    // that status queued is for status 200 and axios will throw other non 2XX responses
    // however, we need to have "consistent return" on a method, so warn and keep the next return
    this.logger.warn('MailGun is not throwing error but not returning 200.');
    return { status: SEND_OK_STATUS };
  }
}

module.exports = MailGun;
