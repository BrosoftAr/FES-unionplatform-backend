const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  static sendEmail = ({
    to,
    subject,
    text,
    html
  }: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) => {
    const msg = {
      to,
      subject,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      text,
      html
    };

    return sgMail.send(msg);
  };
}
export default EmailService;
