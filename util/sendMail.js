const nodemailer = require('nodemailer');

module.exports = sendMail = (subject, text) => {

  const transporter = nodemailer.createTransport({
    host: 'incrix.com',
    port: 465,
    secure: true,
    auth: {
      user: 'no-reply@incrix.com',
      pass: 'crixin14@noreply'
    }
  });

const mailOptions = {
  from: 'no-reply@incrix.com',
  to: 'valliammaig44@gmail.com',
  subject,
  text
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}