const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  const tranporter = nodemailer.createTransport({
    // Looking to send emails in production? Check out our Email API/SMTP product!
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOption = {
    from: "Prashant Singh <falna chilna @gmail.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await tranporter.sendMail(mailOption);
};

module.exports = sendEmail;
