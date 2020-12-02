const Boom = require('@hapi/boom');

const { Mails } = require('../../../../src/api/handlers');
const SendGrid = require('../../../../src/lib/mails/send-grid');
const MailGun = require('../../../../src/lib/mails/mail-gun');

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

// mock SendGrid.send() method implementation
const mockMailGunSend = jest.fn(() => true);
jest.mock('../../../../src/lib/mails/mail-gun');
MailGun.mockImplementation(() => {
  return {
    send: mockMailGunSend,
  };
});

describe('Mails handlers', () => {
  describe('sendEmail method', () => {
    const mockH = {
      response: jest.fn(() => ({
        code: (httpCode) => httpCode,
      })),
    };

    const mockLogger = {
      error: jest.fn(),
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

      expect(mockRequest.server.MailProviders[0]).toBe(SendGrid);
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

    it('should set succesful mailProvider (e.g. MailGun) as the first item in the array at the end of the function call if SendMail fails to send.', async () => {
      const mockRequest = {
        server: { MailProviders: [SendGrid, MailGun] },
        payload: {},
        logger: mockLogger,
      };

      const customErr = new Error('SendGrid error');
      mockSendGridSend.mockImplementationOnce(() => {
        throw customErr;
      });

      const result = await Mails.sendEmail(mockRequest, mockH);

      expect(result).toBe(HTTP_ACCEPTED_CODE);
      expect(Boom.badRequest).not.toHaveBeenCalled();
      expect(Boom.serverUnavailable).not.toHaveBeenCalled();

      expect(mockLogger.error).toHaveBeenCalledTimes(2);
      expect(mockRequest.server.MailProviders[0]).toBe(MailGun);
      expect(mockRequest.server.MailProviders[1]).toBe(SendGrid);
    });

    it('should throw BadRequest when there are too many recipients', async () => {
      const mockRequest = {
        server: { MailProviders: [SendGrid, MailGun] },
        payload: {},
        logger: mockLogger,
      };

      mockSendGridSend.mockImplementationOnce(() => {
        throw new Error(ERRORS.RECIPIENT_LIMIT);
      });

      expect.assertions(3);

      try {
        await Mails.sendEmail(mockRequest, mockH);
      } catch (err) {
        expect(Boom.badRequest).toHaveBeenCalledWith(ERRORS.RECIPIENT_LIMIT);
        expect(mockLogger.error).not.toHaveBeenCalled();
        expect(mockMailGunSend).not.toHaveBeenCalled();
      }
    });
  });
});
