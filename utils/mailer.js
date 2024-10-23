const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { log, error } = require("./consoller");
dotenv.config("../../.env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (recipient, subject, content, resumePath) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: recipient,
    subject: subject,
    text: content,
    attachments: [
      {
        filename: "resume.pdf",
        path: resumePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    log(`Email sent to ${recipient}`);
  } catch (err) {
    error(`Error sending email to ${recipient}: ${err}`);
  }
};

module.exports = {
  sendEmail,
};