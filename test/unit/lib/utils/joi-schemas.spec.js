const { emailAddress, mail, mailAccepted } = require('../../../../src/lib/utils/joi-schemas');

describe('joi-schema.js', () => {
  describe('emailAddress schema', () => {
    it('should validate a valid email address string', () => {
      const result = emailAddress.validate('example1@email.com');

      expect(result.value).toEqual('example1@email.com');
      expect(result).not.toHaveProperty('error');
    });

    it('should invalidate non email address string', () => {
      const result = emailAddress.validate('example1email.com');

      expect(result.error).toBeInstanceOf(Error);

      expect(result.error.message).toEqual('"value" must be a valid email');
      expect(result).toHaveProperty('error');
    });
  });

  describe('mail schema', () => {
    it('should validate payload with all required fields', () => {
      const payload = {
        tos: ['exampl1@email.com'],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result).not.toHaveProperty('error');
    });

    it('should validate payload with all required fields + valid ccs field', () => {
      const payload = {
        tos: ['example1@email.com'],
        ccs: ['example2@email.com'],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result).not.toHaveProperty('error');
    });

    it('should validate payload with all required fields + valid bccs field', () => {
      const payload = {
        tos: ['example1@email.com'],
        bccs: ['example2@email.com'],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result).not.toHaveProperty('error');
    });

    it('should validate payload with all required fields + valid ccs, bccs fields', () => {
      const payload = {
        tos: ['example1@email.com'],
        ccs: ['example2@email.com'],
        bccs: ['example3@email.com'],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result).not.toHaveProperty('error');
    });

    it('should validate payload with multiple email addresses', () => {
      const payload = {
        tos: ['example1@email.com', 'example4@email.com'],
        ccs: ['example2@email.com', 'example5@email.com'],
        bccs: ['example3@email.com', 'example6@email.com'],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result).not.toHaveProperty('error');
    });

    it('should validate payload when optional ccs is an empty array', () => {
      const payload = {
        tos: ['example1@email.com'],
        ccs: [],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result).not.toHaveProperty('error');
    });

    it('should validate payload when optional bccs is an empty array', () => {
      const payload = {
        tos: ['example1@email.com'],
        bccs: [],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result).not.toHaveProperty('error');
    });

    it('should invalidate payload without tos', () => {
      const payload = {
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"tos" is required');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload without subject', () => {
      const payload = {
        tos: ['example1@email.com'],
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"subject" is required');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload without content', () => {
      const payload = {
        tos: ['example1@email.com'],
        subject: 'Test subject',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"content" is required');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when tos is a number', () => {
      const payload = {
        tos: 12,
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"tos" must be an array');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when tos is a number array', () => {
      const payload = {
        tos: [12],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"tos[0]" must be a string');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when tos is a non email address string array', () => {
      const payload = {
        tos: ['abc'],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"tos[0]" must be a valid email');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when contain non allowed property', () => {
      const payload = {
        tos: ['example1@email.com'],
        abc: 'abc',
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"abc" is not allowed');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when optional ccs field is not an array', () => {
      const payload = {
        tos: ['example1@email.com'],
        ccs: 12,
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"ccs" must be an array');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when optional ccs field is not an array of string', () => {
      const payload = {
        tos: ['example1@email.com'],
        ccs: [12],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"ccs[0]" must be a string');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when optional ccs field is not an array', () => {
      const payload = {
        tos: ['example1@email.com'],
        ccs: ['abc'],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"ccs[0]" must be a valid email');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when optional bccs field is not an array', () => {
      const payload = {
        tos: ['example1@email.com'],
        bccs: 12,
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"bccs" must be an array');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when optional bccs field is not an array of string', () => {
      const payload = {
        tos: ['example1@email.com'],
        bccs: [12],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"bccs[0]" must be a string');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when optional bccs field is not an array', () => {
      const payload = {
        tos: ['example1@email.com'],
        bccs: ['abc'],
        subject: 'Test subject',
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"bccs[0]" must be a valid email');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when subject is a number', () => {
      const payload = {
        tos: ['example1@email.com'],
        subject: 123,
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"subject" must be a string');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when subject is a boolean', () => {
      const payload = {
        tos: ['example1@email.com'],
        subject: true,
        content: 'Test content',
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"subject" must be a string');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when content is a number', () => {
      const payload = {
        tos: ['example1@email.com'],
        subject: 'Test subject',
        content: 123,
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"content" must be a string');
      expect(result).toHaveProperty('error');
    });

    it('should invalidate payload when content is a boolean', () => {
      const payload = {
        tos: ['example1@email.com'],
        subject: 'Test subject',
        content: false,
      };
      const result = mail.validate(payload);

      expect(result.error.message).toEqual('"content" must be a string');
      expect(result).toHaveProperty('error');
    });
  });

  describe('mailAccepted schema', () => {
    it('should validate mailAccepted response', () => {
      const result = mailAccepted.validate({ status: 'queued' });

      expect(result).not.toHaveProperty('error');
    });

    it('should invalidate mailAccepted response when status is not "queued"', () => {
      const result = mailAccepted.validate({ status: 'random' });

      expect(result.error.message).toEqual('"status" must be [queued]');
      expect(result).toHaveProperty('error');
    });
  });
});
