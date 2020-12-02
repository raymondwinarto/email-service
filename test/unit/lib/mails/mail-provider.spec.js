const MailProvider = require('../../../../src/lib/mails/mail-provider');

describe('mail-prodiver.js', () => {
  describe('constructor method', () => {
    it('should set all object properties correctly', () => {
      const payload = {
        tos: ['mock to'],
        ccs: ['mock cc'],
        bccs: ['mock bcc'],
        subject: 'mock subject',
        content: 'mock content',
      };

      const mailProvider = new MailProvider(payload, 'mock logger');

      expect(mailProvider).toEqual(
        expect.objectContaining({
          from: 'Raymond SendGrid Service <raymondandwork@gmail.com>',
          tos: ['mock to'],
          ccs: ['mock cc'],
          bccs: ['mock bcc'],
          subject: 'mock subject',
          content: 'mock content',
          logger: 'mock logger',
        })
      );
    });

    it('should set the default values of ccs, bccs and logger if not passed', () => {
      const mailProvider = new MailProvider({});

      expect(mailProvider).toEqual(
        expect.objectContaining({
          ccs: [],
          bccs: [],
          logger: console,
        })
      );
    });
  });

  describe('isTotalRecipientsAllowed method', () => {
    it('should return true when total recipients is less than 1000', () => {
      const payload = {
        tos: ['mock to'],
        ccs: ['mock cc'],
        bccs: ['mock bcc'],
      };

      const mailProvider = new MailProvider(payload, 'mock logger');

      expect(mailProvider.isTotalRecipientsAllowed()).toBe(true);
    });

    it('should return true when total recipients is equal to 1000', () => {
      const payload = {
        tos: new Array(1000),
      };

      const mailProvider = new MailProvider(payload, 'mock logger');

      expect(mailProvider.isTotalRecipientsAllowed()).toBe(true);
    });

    it('should return false when total recipients is more than 1000', () => {
      const payload = {
        tos: new Array(1001),
      };

      const mailProvider = new MailProvider(payload, 'mock logger');

      expect(mailProvider.isTotalRecipientsAllowed()).toBe(false);
    });
  });
});
