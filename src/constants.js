module.exports = {
  SEND_QUEUED_STATUS: 'queued',
  HTTP_OK_CODE: 200,
  HTTP_ACCEPTED_CODE: 202,
  MAX_RECIPIENTS: 1000,
  ERRORS: {
    RECIPIENT_LIMIT: 'Too Many Recipients.',
    EMAIL_NOT_QUEUED: 'Email is valid but not queued (Sandbox mode).',
    NON_200_RESPONSE: 'Response status 2XX but not 200.',
  },
};
