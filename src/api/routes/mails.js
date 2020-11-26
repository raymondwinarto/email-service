const { Mails } = require('../handlers');

const failAction = require('../../lib/utils/fail-action');
const { mail } = require('../../lib/utils/joi-schemas');

const routes = [
  {
    method: 'POST',
    path: '/mails',
    options: {
      description: 'Send an email.',
      tags: ['api'],
      validate: {
        payload: mail,
        failAction,
      },
    },
    handler: Mails.sendEmail,
  },
];

module.exports = routes;
