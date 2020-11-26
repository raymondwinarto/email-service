const Boom = require('@hapi/boom');

const utils = {
  failAction: async (request, h, err) => {
    if (process.env.NODE_ENV === 'prod') {
      // in prod, log a limited error message and throw the default Bad Request error.
      throw Boom.badRequest(`Invalid request payload input`);
    } else {
      // during development, log and respond with the full error.
      throw err;
    }
  },
};

module.exports = utils;
