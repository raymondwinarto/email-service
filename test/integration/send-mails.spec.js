// Note: This integration test is to cover the route and server codes
// This should be just smoke testings because unit tests have covered
// the detailed/more comprehensive testings

const axios = require('axios');

jest.mock('axios');
const mockAxiosPost = jest.fn();
axios.create.mockImplementation(() => {
  return { post: mockAxiosPost };
});

const { HTTP_ACCEPTED_CODE, SEND_QUEUED_STATUS, ERRORS } = require('../../src/constants');
const server = require('../../src/server');

const internals = {};

describe('POST /mails', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    internals.server = await server({ start: false });
  });

  afterEach(async () => {
    await internals.server.stop();
  });

  it('should response with 202 Accepted with status "queued"', async () => {
    mockAxiosPost.mockImplementationOnce(() => {
      return { status: HTTP_ACCEPTED_CODE };
    });

    const request = {
      method: 'POST',
      url: '/mails',
      payload: {
        tos: ['example1@email.com'],
        ccs: ['example2@email.com'],
        bccs: ['example3@email.com'],
        subject: 'mock subject',
        content: 'mock content',
      },
    };

    const response = await internals.server.inject(request);

    expect(response.statusCode).toBe(HTTP_ACCEPTED_CODE);
    expect(response.result).toEqual({
      status: SEND_QUEUED_STATUS,
    });
  });

  it('should return Bad Request error when invalid payload is used', async () => {
    // mockAxiosPost.mockImplementationOnce(() => {
    //   return { status: HTTP_ACCEPTED_CODE };
    // });

    const request = {
      method: 'POST',
      url: '/mails',
      payload: {
        tos: ['example1emailcom'], // this should contain valid email address
        subject: 'mock subject',
        content: 'mock content',
      },
    };

    const response = await internals.server.inject(request);

    expect(response.statusCode).toBe(400);
    expect(response.result.message).toBe('"tos[0]" must be a valid email');
  });

  it('should return Service Unvailable error all axios request fail', async () => {
    mockAxiosPost.mockImplementationOnce(() => {
      throw new Error('mock service unavailable error');
    });
    mockAxiosPost.mockImplementationOnce(() => {
      throw new Error('mock service unavailable error');
    });

    const request = {
      method: 'POST',
      url: '/mails',
      payload: {
        tos: ['example1@email.com'],
        subject: 'mock subject',
        content: 'mock content',
      },
    };

    const response = await internals.server.inject(request);

    expect(response.statusCode).toBe(503);
    expect(response.result.message).toBe(ERRORS.MAIL_PROVIDER_UNAVAILABLE);
  });
});
