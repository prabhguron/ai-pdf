const SendGridEmailService = require("./sendGridEmailService");

const mailServiceFactory = {
    createMailService: function(type) {
      switch (type) {
        case 'sendgrid':
          return new SendGridEmailService();
        default:
          throw new Error(`Invalid email service type: ${type}`);
      }
    }
};

class MailService {
    constructor(mailServiceFactory) {
      this.mailServiceFactory = mailServiceFactory;
    }
  
    async sendEmail(options) {
      const emailService = this.mailServiceFactory.createMailService(process.env.MAIL_SERVICE);
      return emailService.sendMail(options);
    }
}

module.exports = new MailService(mailServiceFactory);