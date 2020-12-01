const { MAX_RECIPIENTS } = require('../../constants');

class MailProvider {
  constructor({ tos, ccs = [], bccs = [], subject, content }, logger = console) {
    this.from = 'Raymond SendGrid Service <raymondandwork@gmail.com>';
    this.tos = tos;
    this.ccs = ccs;
    this.bccs = bccs;
    this.subject = subject;
    this.content = content;
    this.logger = logger;
  }

  isTotalRecipientsAllowed() {
    // Both MailGun and SendGrid have limit of 1000 recipients
    return this.tos.length + this.ccs.length + this.bccs.length < MAX_RECIPIENTS + 1;
  }
}

module.exports = MailProvider;
