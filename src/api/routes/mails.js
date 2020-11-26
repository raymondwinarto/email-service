const Joi = require('joi');

const { Mails } = require('../handlers');
const { failAction } = require('../../lib/utils');

const routes = [
  {
    method: 'POST',
    path: '/mails',
    options: {
      description: 'Send an email.',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          tos: Joi.array().items(Joi.string().email()).required(),
          ccs: Joi.array().items(Joi.string().email()),
          bccs: Joi.array().items(Joi.string().email()),
          subject: Joi.string().required(),
          content: Joi.string().required(),
        }),
        failAction,
      },
    },
    handler: Mails.sendEmail,
  },
];

module.exports = routes;
