const SendGrid = require('../lib/mails/send-grid');
const MailGun = require('../lib/mails/mail-gun');

const routes = require('./routes');

exports.plugin = {
  name: 'api',
  version: '0.0.1',

  register: async (server) => {
    server.route([...routes]);

    const mailProviders = [
      {
        Service: SendGrid,
        active: true,
      },
      {
        Service: MailGun,
        active: false,
      },
    ];

    server.decorate('request', 'mailProviders', mailProviders);
  },
};
