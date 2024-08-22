const sgMail = require("@sendgrid/mail");

class SendGridEmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendMail(options) {
    try{
        const payload = {
            from: process.env.SENDGRID_FROM,
            ...options
        };
        //console.log(payload);
        const result = await sgMail.send(payload);
        //console.log(result);
        return true;
    }catch(e){
        console.error(e.message);
    }   
    return false;
  }
}

module.exports = SendGridEmailService;