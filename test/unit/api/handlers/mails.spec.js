const Boom = require('@hapi/boom');

const { Mails } = require('../../../../src/api/handlers');
const SendGrid = require('../../../../src/lib/mails/send-grid');

const { HTTP_ACCEPTED_CODE, ERRORS } = require('../../../../src/constants');

jest.mock('@hapi/boom');

// mock SendGrid.send() method implementation
const mockSendGridSend = jest.fn(() => true);
jest.mock('../../../../src/lib/mails/send-grid');
SendGrid.mockImplementation(() => {
  return {
    send: mockSendGridSend,
  };
});

describe('Mails handlers', () => {
  describe('sendEmail method', () => {
    const mockH = {
      response: jest.fn(() => ({
        code: (httpCode) => httpCode,
      })),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return response with HTTP ACCEPTED code', async () => {
      const mockRequest = {
        server: { MailProviders: [SendGrid] },
        payload: {},
      };

      const result = await Mails.sendEmail(mockRequest, mockH);

      expect(result).toBe(HTTP_ACCEPTED_CODE);
      expect(Boom.badRequest).not.toHaveBeenCalled();
      expect(Boom.serverUnavailable).not.toHaveBeenCalled();
    });

    it('should throw Boom serverUnvailable when all send attempt fail', async () => {
      const mockRequest = {
        server: { MailProviders: [SendGrid] },
        payload: {},
      };

      mockSendGridSend.mockImplementationOnce(() => false);

      expect.assertions(2);

      try {
        await Mails.sendEmail(mockRequest, mockH);
      } catch (err) {
        expect(Boom.serverUnavailable).toHaveBeenCalledWith(ERRORS.MAIL_PROVIDER_UNAVAILABLE);
        expect(Boom.badRequest).not.toHaveBeenCalled();
      }
    });
  });
});
