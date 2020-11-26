// const Joi = require('@hapi/joi');
const { Mails } = require('../handlers');

const routes = [
  {
    method: 'POST',
    path: '/mails',
    options: {
      description: 'Send an email.',
      tags: ['api'],
    },
    handler: Mails.sendEmail,
  },
];

module.exports = routes;
