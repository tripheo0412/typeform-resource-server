const nodemailer = require('nodemailer');

const { keys } = require('../../config');

const transporter = nodemailer.createTransport({
  service: keys.MAILER_SERVICE,
  auth: {
    user: keys.MAILER_USER,
    pass: keys.MAILER_PASSWORD,
  },
});

module.exports = {
  transporter,
};
