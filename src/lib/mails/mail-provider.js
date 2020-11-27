class MailProvider {
  constructor({ tos, ccs, bccs, subject, content }) {
    this.tos = tos;
    this.ccs = ccs;
    this.bccs = bccs;
    this.subject = subject;
    this.content = content;
  }
}

module.exports = MailProvider;
