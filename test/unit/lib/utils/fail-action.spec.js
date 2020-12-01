const Boom = require('@hapi/boom');

const failAction = require('../../../../src/lib/utils/fail-action');
const { ERRORS } = require('../../../../src/constants');

describe('fail-action.js', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should throw Boom Bad Request error on prod environment', () => {
    process.env.NODE_ENV = 'prod';
    const badRequestSpy = jest.spyOn(Boom, 'badRequest');

    expect.assertions(2);

    try {
      failAction();
    } catch (err) {
      expect(badRequestSpy).toHaveBeenCalledTimes(1);
      expect(err.message).toBe(ERRORS.INVALID_REQUEST_PAYLOAD);
    }
  });

  it('should throw whever error passed to the function on non PROD environment', () => {
    const customErr = new Error('mock non prod error');

    expect.assertions(2);

    try {
      failAction('mock request', 'mock h', customErr);
    } catch (err) {
      expect(err.message).toBe('mock non prod error');
      expect(err).toBe(customErr);
    }
  });
});
