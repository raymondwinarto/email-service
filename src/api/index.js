const SendGrid = require('../lib/mails/send-grid');
const MailGun = require('../lib/mails/mail-gun');

const routes = require('./routes');

exports.plugin = {
  name: 'api',
  version: '0.0.1',

  register: async (server) => {
    server.route([...routes]);

    // first in the array will be the first attempt
    // more mail providers can be added to the array below
    // without having to change failover logic
    const MailProviders = [SendGrid, MailGun];

    server.decorate('server', 'MailProviders', MailProviders);
  },
};
