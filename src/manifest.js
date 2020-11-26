const Confidence = require('confidence');
const Toys = require('toys');
const Package = require('../package');

module.exports = new Confidence.Store({
  server: {
    port: process.env.PORT,
    router: {
      stripTrailingSlash: true,
    },
    routes: {
      response: {
        emptyStatusCode: 200,
      },
      validate: {
        options: {
          abortEarly: false,
        },
      },
    },
    debug: {
      $filter: { $env: 'NODE_ENV' },
      $default: {
        log: ['error', 'implementation', 'internal'],
        request: ['error', 'implementation', 'internal'],
      },
      production: {
        request: ['implementation'],
      },
    },
  },
  register: {
    plugins: [
      {
        // @hapi/inert is a required dependency for hapi-swagger
        plugin: '@hapi/inert',
      },
      {
        // @hapi/vision is a required dependency for hapi-swagger
        plugin: '@hapi/vision',
      },
      {
        plugin: {
          $filter: { $env: 'NODE_ENV' },
          $default: 'hapi-pino',
          testing: Toys.noop,
        },
        options: {
          $filter: { $env: 'NODE_ENV' },
          $default: {
            logPayload: true,
            prettyPrint: { colorize: true, translateTime: true },
            logRequestStart: true,
            logRequestComplete: true,
          },
          production: {
            prettyPrint: false,
          },
        },
      },
      {
        plugin: 'disinfect',
        options: {
          disinfectQuery: true,
          disinfectParams: true,
          disinfectPayload: true,
        },
      },
      {
        plugin: {
          $filter: { $env: 'NODE_ENV' },
          $default: 'hapi-swagger',
          production: Toys.noop,
          testing: Toys.noop,
        },
        options: {
          info: {
            title: 'Email Service - Api Documentation',
            version: Package.version,
          },
          schemes: ['http', 'https'],
        },
      },
    ],
  },
});
