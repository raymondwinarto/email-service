class MailProvider {
  constructor({ tos, ccs, bccs, subject, content }, logger = console) {
    this.tos = tos;
    this.ccs = ccs;
    this.bccs = bccs;
    this.subject = subject;
    this.content = content;
    this.logger = logger;
  }
}

module.exports = MailProvider;
