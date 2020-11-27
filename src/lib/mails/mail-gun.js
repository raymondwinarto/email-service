const FormData = require('form-data');
const axios = require('axios');

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

class MailGun {
  constructor({ tos, ccs, bccs, subject, content }) {
    this.tos = tos;
    this.ccs = ccs;
    this.bccs = bccs;
    this.subject = subject;
    this.content = content;
  }

  async send() {
    try {
      const form = new FormData();

      form.append('from', 'raymond@sandbox4df00f20e1aa4995b2b54395c62ee0df.mailgun.org');
      form.append('subject', this.subject);
      form.append('text', this.content);

      this.tos.forEach((email) => {
        form.append('to', email);
      });

      const response = await axiosInstance.post('/messages', form, { headers: form.getHeaders() });
      return response.status === 200;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return error.response.status;
      }

      if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        return error.request;
      }

      return error.config;
    }
  }
}

module.exports = MailGun;