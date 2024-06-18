const transporter = require('../config/emailConfig');

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: `"Asset Tracking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
};

module.exports = sendEmail;
