const Glue = require('@hapi/glue');
const server = require('../src/server');

jest.mock('@hapi/glue');
jest.mock('../src/manifest', () => {
  return {
    get: () => 'mock manifest',
  };
});

const mockServer = {
  initialize: jest.fn(),
  start: jest.fn(),
  logger: { info: jest.fn() },
  info: { uri: 'mock uri ' },
};
Glue.compose.mockImplementation(() => mockServer);

describe('server.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the server and return the server object when "start" option is false', async () => {
    const result = await server({ start: false });

    expect(mockServer.initialize).toHaveBeenCalledTimes(1);
    expect(mockServer.start).not.toHaveBeenCalled();
    expect(result).toEqual(mockServer);
  });

  it('should initialize the server and return the server object when "start" option is not defined', async () => {
    const result = await server();

    expect(mockServer.initialize).toHaveBeenCalledTimes(1);
    expect(mockServer.start).not.toHaveBeenCalled();
    expect(result).toEqual(mockServer);
  });

  it('should start the server and return the server object when "start" option is true', async () => {
    const result = await server({ start: true });

    expect(mockServer.initialize).not.toHaveBeenCalled();
    expect(mockServer.start).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockServer);
  });
});
