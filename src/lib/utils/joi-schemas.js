const Joi = require('joi');

const emailAddress = Joi.string().email().description('email address');

const mail = Joi.object({
  tos: Joi.array()
    .items(emailAddress)
    .required()
    .example(['email1@example.com', 'email2@example.com']),
  ccs: Joi.array().items(emailAddress).example(['email3@example.com', 'email4@example.com']),
  bccs: Joi.array().items(emailAddress).example(['email5@example.com', 'email6@example.com']),
  subject: Joi.string().required().description('email subject').example('RE: Sending Email Issue'),
  content: Joi.string()
    .required()
    .description('email text/plain content')
    .example('Dear Sir/Madam,\n\nThere is a problem in sending email.\n\nRegards,\n\nPerson'),
}).label('mail');

const mailAccepted = Joi.object({
  status: Joi.string().valid('queued'),
}).label('accepted');

const mailOk = Joi.object({
  status: Joi.string().valid('ok'),
}).label('ok');

module.exports = {
  emailAddress,
  mail,
  mailAccepted,
  mailOk,
};
