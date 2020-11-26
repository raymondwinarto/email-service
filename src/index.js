const server = require('./server');

process.on('unhandledRejection', (err) => {
  throw err;
});

server({ start: true });
