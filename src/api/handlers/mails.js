const handlers = {
  sendEmail(request, h) {
    const { payload } = request;

    return h.response(payload).code(201);
  },
};

module.exports = handlers;
