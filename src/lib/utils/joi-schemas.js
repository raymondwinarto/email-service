const Joi = require('joi');

const emailAddress = Joi.string().email().description('Email Address');

const mail = Joi.object({
  tos: Joi.array().items(emailAddress).required().label('Email Address List'),
  ccs: Joi.array().items(emailAddress),
  bccs: Joi.array().items(emailAddress),
  subject: Joi.string().required(),
  content: Joi.string().required(),
}).label('Mail');

module.exports = {
  emailAddress,
  mail,
};
