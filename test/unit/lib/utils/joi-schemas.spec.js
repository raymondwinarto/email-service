const { internal, expectationFailed } = require('@hapi/boom');
const { describe } = require('joi');
const { emailAddress, mail, mailAccepted } = require('../../../../src/lib/utils/joi-schemas');

describe('joi-schema.js', () => {
  describe('emailAddress method', () => {
    it('should validate a valid email address', () => {
      const result = emailAddress.validate('example1@email.com');
      expect(result).toBe('example1@email.com');
    });
  });
});
