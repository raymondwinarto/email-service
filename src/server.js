const Glue = require('@hapi/glue');

const manifest = require('./manifest').get('/');

module.exports = async ({ start }) => {
  const server = await Glue.compose(manifest, { relativeTo: __dirname });

  if (!start) {
    // for testing, we can initializes the server (starts the caches,
    // finalizes plugin registration) but does not start listening on the connection port.
    await server.initialize();
    return server;
  }

  await server.start();
  server.logger.info(`Server is running on ${server.info.uri}`);

  return server;
};
