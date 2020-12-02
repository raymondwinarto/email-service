const FormData = require('form-data');
const axios = require('axios');

jest.mock('form-data');

jest.mock('axios');
const mockAxiosPost = jest.fn();

// we need to mock before requiring mail-gun.js because axios.create
// is used as soon as we require mail-gun.js
axios.create.mockImplementation(() => {
  return { post: mockAxiosPost };
});

const MailGun = require('../../../../src/lib/mails/mail-gun');

const { HTTP_OK_CODE, ERRORS } = require('../../../../src/constants');

describe('lib/mail-gun.js', () => {
  describe('send() method', () => {
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
        return { status: HTTP_OK_CODE };
      });

      const mailGun = new MailGun(payload);
      const result = await mailGun.send();

      expect(result.status).toBe(HTTP_OK_CODE);

      const formDataInstance = FormData.mock.instances[0];
      expect(formDataInstance.append).toHaveBeenCalledWith('from', mailGun.from);
      expect(formDataInstance.append).toHaveBeenCalledWith('to', payload.tos[0]);
      expect(formDataInstance.append).toHaveBeenCalledWith('subject', payload.subject);
      expect(formDataInstance.append).toHaveBeenCalledWith('text', payload.content);
    });

    it('should have append all items in tos array to "to" form field', async () => {
      const payload = {
        tos: ['mock to 1', 'mock to 2', 'mock to 3'],
        subject: 'mock subject',
        content: 'mock content',
      };

      mockAxiosPost.mockImplementationOnce(() => {
        return { status: HTTP_OK_CODE };
      });

      const mailGun = new MailGun(payload);
      const result = await mailGun.send();

      expect(result.status).toBe(HTTP_OK_CODE);

      const formDataInstance = FormData.mock.instances[0];
      expect(formDataInstance.append).toHaveBeenCalledWith('to', payload.tos[0]);
      expect(formDataInstance.append).toHaveBeenCalledWith('to', payload.tos[1]);
      expect(formDataInstance.append).toHaveBeenCalledWith('to', payload.tos[2]);
    });

    it('should append cc and bcc when included in payload', async () => {
      const payload = {
        tos: ['mock to 1'],
        ccs: ['mock to 2'],
        bccs: ['mock to 3'],
        subject: 'mock subject',
        content: 'mock content',
      };

      mockAxiosPost.mockImplementationOnce(() => {
        return { status: HTTP_OK_CODE };
      });

      const mailGun = new MailGun(payload);
      const result = await mailGun.send();

      expect(result.status).toBe(HTTP_OK_CODE);

      const formDataInstance = FormData.mock.instances[0];
      expect(formDataInstance.append).toHaveBeenCalledWith('cc', payload.ccs[0]);
      expect(formDataInstance.append).toHaveBeenCalledWith('bcc', payload.bccs[0]);
    });

    it('should not append cc or bcc when ccs and bccs do not exist in paylod', async () => {
      const payload = {
        tos: ['mock to 1'],
        subject: 'mock subject',
        content: 'mock content',
      };

      mockAxiosPost.mockImplementationOnce(() => {
        return { status: HTTP_OK_CODE };
      });

      const mailGun = new MailGun(payload);
      const result = await mailGun.send();

      expect(result.status).toBe(HTTP_OK_CODE);

      const formDataInstance = FormData.mock.instances[0];
      expect(formDataInstance.append).not.toHaveBeenCalledWith('cc', expect.anything());
      expect(formDataInstance.append).not.toHaveBeenCalledWith('bcc', expect.anything());
    });

    it('should not append cc or bcc when ccs and bccs are empty array', async () => {
      const payload = {
        tos: ['mock to 1'],
        ccs: [],
        bccs: [],
        subject: 'mock subject',
        content: 'mock content',
      };

      mockAxiosPost.mockImplementationOnce(() => {
        return { status: HTTP_OK_CODE };
      });

      const mailGun = new MailGun(payload);
      const result = await mailGun.send();

      expect(result.status).toBe(HTTP_OK_CODE);

      const formDataInstance = FormData.mock.instances[0];
      expect(formDataInstance.append).not.toHaveBeenCalledWith('cc', expect.anything());
      expect(formDataInstance.append).not.toHaveBeenCalledWith('bcc', expect.anything());
    });

    it('should throw recipients limit error when total receipients exceeding the limit', async () => {
      const payload = {
        tos: new Array(1001),
        subject: 'mock subject',
        content: 'mock content',
      };

      expect.assertions(1);

      try {
        const mailGun = new MailGun(payload);
        await mailGun.send();
      } catch (err) {
        expect(err.message).toBe(ERRORS.RECIPIENT_LIMIT);
      }
    });

    it('should throw non 200 reponse error when response status is not 200', async () => {
      const payload = {
        tos: ['mock to 1'],
        subject: 'mock subject',
        content: 'mock content',
      };

      mockAxiosPost.mockImplementationOnce(() => {
        return { status: 202 };
      });

      expect.assertions(1);

      try {
        const mailGun = new MailGun(payload);
        await mailGun.send();
      } catch (err) {
        expect(err.message).toBe(ERRORS.NON_200_RESPONSE);
      }
    });
  });
});
