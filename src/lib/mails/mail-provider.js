const FROM = 'Raymond SendGrid Service <raymondandwork@gmail.com>';

class MailProvider {
  constructor({ tos, ccs, bccs, subject, content }, logger = console) {
    this.from = FROM;
    this.tos = tos;
    this.ccs = ccs;
    this.bccs = bccs;
    this.subject = subject;
    this.content = content;
    this.logger = logger;
  }
}

module.exports = MailProvider;
