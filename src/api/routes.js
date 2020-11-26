// const Joi = require('@hapi/joi');
const handlers = require('./handlers');

const routes = [
  {
    method: 'GET',
    path: '/api/email',
    options: {
      description: 'Test route',
      tags: ['api'],
    },
    handler: handlers.get,
  },
];

module.exports = routes;
