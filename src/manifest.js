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
      security: true,
      validate: {
        options: {
          abortEarly: false,
        },
      },
    },
    debug: false,
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
          test: Toys.noop,
        },
        options: {
          $filter: { $env: 'NODE_ENV' },
          $default: {
            logPayload: true,
            // when false, log is in json - can easily be parsed by log analysis tool
            // such as splunk, newRelic, cloudWatch, etc
            prettyPrint: false,
            logRequestStart: true,
            logRequestComplete: true,
          },
          dev: {
            prettyPrint: { colorize: true, translateTime: true },
          },
        },
      },
      {
        // swagger is disabled in prod and test
        // prod: this service  is not a public API - no need swagger
        // test: is used by jest - no need for swagger
        plugin: {
          $filter: { $env: 'NODE_ENV' },
          $default: 'hapi-swagger',
          prod: Toys.noop,
          test: Toys.noop,
        },
        options: {
          $filter: { $env: 'NODE_ENV' },
          $default: {
            info: {
              title: 'Email Service - Api Documentation',
              version: Package.version,
            },
            definitionPrefix: 'useLabel',
            schemes: ['https'],
          },
          dev: {
            // dev environment is not running on https
            schemes: ['http'],
          },
        },
      },
      {
        plugin: './api',
      },
    ],
  },
});
