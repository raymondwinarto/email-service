const routes = require('./routes');

exports.plugin = {
  name: 'api',
  version: '0.0.1',

  register: async (server) => {
    server.route([...routes]);
  },
};
