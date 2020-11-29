class MailProvider {
  constructor({ tos, ccs, bccs, subject, content }, logger = console) {
    this.OK_HTTP_CODE = 200;
    this.ACCEPTED_HTTP_CODE = 202;
    this.FROM = 'Raymond SendGrid Service <raymondandwork@gmail.com>';
    this.OK_STATUS = 'ok';
    this.QUEUE_STATUS = 'queued';

    this.tos = tos;
    this.ccs = ccs;
    this.bccs = bccs;
    this.subject = subject;
    this.content = content;
    this.logger = logger;
  }
}

module.exports = MailProvider;
