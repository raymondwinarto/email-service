const handlers = {
  sendEmail(request, h) {
    return h.response('Test string').code(201);
  },
};

module.exports = handlers;
