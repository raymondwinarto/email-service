const axios = require('axios');
const FormData = require('form-data');

const MailProvider = require('./mail-provider');
const { HTTP_OK_CODE } = require('../../constants');

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

    // MailGun returns 200 OK to say that everything is ok, email is queued for sending
    if (response.status === HTTP_OK_CODE) return response;

    // MailGun only specifies one 2XX code which is 200 and we want to be sure
    // that status queued is for status 200 and axios will throw other non 2XX responses
    // however, we need to do something in case response status is 2XX other than 200
    // we should consider this as error since email will not be sent
    throw new Error('MailGun Error: 2XX is return but not 200.');
  }
}

module.exports = MailGun;
