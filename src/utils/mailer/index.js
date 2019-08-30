const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const handlebars = require('express-handlebars');
const path = require('path');
const { keys } = require('../../config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    clientId: keys.googleAuth.clientID,
    clientSecret: keys.googleAuth.clientSecret,
  },
});
const viewEngine = handlebars.create({
  partialsDir: 'partials/',
  defaultLayout: false,
});
const sut = hbs({
  viewEngine,
  viewPath: path.resolve(__dirname, '../../../views'),
});
transporter.use('compile', sut);
const mail = {
  from: '"Typeform" <yazan.alhalabi@integrify.io>',
  to: '',
  subject: '',
  auth: {
    user: 'yazan.alhalabi@integrify.io',
    refreshToken: keys.googleTokens.refreshToken,
    accessToken: keys.googleTokens.accessToken,
  },
  template: 'verify',
  context: {
    action_url: '',
  },
};

module.exports = { mail, transporter };
