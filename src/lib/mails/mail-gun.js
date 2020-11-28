const axios = require('axios');
const FormData = require('form-data');

const MailProvider = require('./mail-provider');

const { MAILGUN_API_KEY, MAILGUN_API_BASE_URL } = process.env;

const axiosInstance = axios.create({
  baseURL: MAILGUN_API_BASE_URL,
  timeout: 20000,
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

    form.append('from', 'Raymond MailGun Service <raymondandwork@gmail.com>');
    form.append('subject', this.subject);
    form.append('text', this.content);

    this.tos.forEach((email) => {
      form.append('to', email);
    });

    // We don't need response because axios will throw error when response is not 2XX
    await axiosInstance.post('/messages', form, { headers: form.getHeaders() });

    // TODO: is there any other possible 2XX response code?
    return { status: 'queued' };
  }
}

module.exports = MailGun;
