const axios = require('axios');

const { SENDGRID_API_KEY, SENDGRID_API_BASE_URL } = process.env;

const axiosInstance = axios.create({
  baseURL: SENDGRID_API_BASE_URL,
  timeout: 20000,
  headers: {
    Authorization: `Bearer ${SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

class SendGridMail {
  constructor({ tos, ccs, bccs, subject, content }) {
    this.tos = tos;
    this.ccs = ccs;
    this.bccs = bccs;
    this.subject = subject;
    this.content = content;
  }

  async send() {
    const to = this.tos.map((email) => ({ email }));

    try {
      const response = await axiosInstance.post('/v3/mail/send', {
        personalizations: [
          {
            to,
          },
        ],
        from: {
          email: 'raymondandwork@gmail.com',
        },
        subject: this.subject,
        content: [
          {
            type: 'text/plain',
            value: this.content,
          },
        ],
      });

      return response.status === 202;
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

module.exports = SendGridMail;
