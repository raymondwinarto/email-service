const axios = require('axios');

jest.mock('axios');
const mockAxiosPost = jest.fn();

// we need to mock before requiring send-grid.js because axios.create
// is used as soon as we require send-grid.js
axios.create.mockImplementation(() => {
  return { post: mockAxiosPost };
});

const SendGrid = require('../../../../src/lib/mails/send-grid');

const { HTTP_ACCEPTED_CODE, ERRORS } = require('../../../../src/constants');

describe('lib/send-grid.js', () => {
  describe('send() method', () => {
    const sendPath = '/v3/mail/send';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return response object when axios response status is 200 OK', async () => {
      const payload = {
        tos: ['mock to 1'],
        subject: 'mock subject',
        content: 'mock content',
      };

      mockAxiosPost.mockImplementationOnce(() => {
        return { status: HTTP_ACCEPTED_CODE };
      });

      const sendGrid = new SendGrid(payload);
      const result = await sendGrid.send();

      expect(result.status).toBe(HTTP_ACCEPTED_CODE);

      expect(mockAxiosPost).toHaveBeenCalledWith(sendPath, {
        personalizations: [
          {
            to: [{ email: 'mock to 1' }],
            cc: null,
            bcc: null,
          },
        ],
        from: {
          email: sendGrid.from,
        },
        subject: payload.subject,
        content: [
          expect.objectContaining({
            value: 'mock content',
          }),
        ],
      });
    });

    it('should send the request with cc and bcc on axios payload when ccs and bccs exist', async () => {
      const payload = {
        tos: ['mock to 1'],
        ccs: ['mock to 2'],
        bccs: ['mock to 3'],
        subject: 'mock subject',
        content: 'mock content',
      };

      mockAxiosPost.mockImplementationOnce(() => {
        return { status: HTTP_ACCEPTED_CODE };
      });

      const sendGrid = new SendGrid(payload);
      const result = await sendGrid.send();

      expect(result.status).toBe(HTTP_ACCEPTED_CODE);

      expect(mockAxiosPost).toHaveBeenCalledWith(
        sendPath,
        expect.objectContaining({
          personalizations: [
            expect.objectContaining({
              cc: [{ email: 'mock to 2' }],
              bcc: [{ email: 'mock to 3' }],
            }),
          ],
        })
      );
    });

    it('should send the request with multiple to email address on axios payload when tos value is more than one', async () => {
      const payload = {
        tos: ['mock to 1', 'mock to 2', 'mock to 3'],
        subject: 'mock subject',
        content: 'mock content',
      };

      mockAxiosPost.mockImplementationOnce(() => {
        return { status: HTTP_ACCEPTED_CODE };
      });

      const sendGrid = new SendGrid(payload);
      const result = await sendGrid.send();

      expect(result.status).toBe(HTTP_ACCEPTED_CODE);

      expect(mockAxiosPost).toHaveBeenCalledWith(
        sendPath,
        expect.objectContaining({
          personalizations: [
            expect.objectContaining({
              to: [{ email: 'mock to 1' }, { email: 'mock to 2' }, { email: 'mock to 3' }],
            }),
          ],
        })
      );
    });

    it('should throw recipients limit error when total receipients exceeding the limit', async () => {
      const payload = {
        tos: new Array(1001),
        subject: 'mock subject',
        content: 'mock content',
      };

      expect.assertions(1);

      try {
        const sendGrid = new SendGrid(payload);
        await sendGrid.send();
      } catch (err) {
        expect(err.message).toBe(ERRORS.RECIPIENT_LIMIT);
      }
    });

    it('should throw email not queued error when response status is not 202', async () => {
      const payload = {
        tos: ['mock to 1'],
        subject: 'mock subject',
        content: 'mock content',
      };

      mockAxiosPost.mockImplementationOnce(() => {
        return { status: 200 };
      });

      expect.assertions(1);

      try {
        const sendGrid = new SendGrid(payload);
        await sendGrid.send();
      } catch (err) {
        expect(err.message).toBe(ERRORS.EMAIL_NOT_QUEUED);
      }
    });
  });
});
