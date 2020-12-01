const Boom = require('@hapi/boom');

const { ERRORS } = require('../../constants');

module.exports = (request, h, err) => {
  if (process.env.NODE_ENV === 'prod') {
    // in prod, log a limited error message and throw the default Bad Request error.
    // this is recommended for security to avoid attackers trying to guess vulnerabilities
    // on our API route - but we can relaxed this if deemed neceesary
    throw Boom.badRequest(ERRORS.INVALID_REQUEST_PAYLOAD);
  } else {
    // during development, log and respond with the full error.
    throw err;
  }
};
