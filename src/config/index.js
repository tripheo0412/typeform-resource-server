require('dotenv').config();
const keysProd = require('./keys_prod');
const keysDev = require('./keys_dev');
const keysTest = require('./keys_test');

let keys;
const generateConfig = env => {
  keys = env;
  keys.VERIFY_SECRET = process.env.verify_secret;
  keys.ACCESS_SECRET = process.env.access_secret;
  keys.RES_PORT = process.env.res_port;
  keys.ISSUER = process.env.issuer;
  keys.DOMAIN = process.env.domain;
  keys.MAILER_USER = process.env.mailer_user;
  keys.MAILER_PASSWORD = process.env.mailer_password;
  keys.MAILER_SERVICE = process.env.mailer_service;
  keys.googleAuth = {
    clientID: process.env.mailer_google_client_id,
    clientSecret: process.env.mailer_google_client_secret,
  };
  keys.googleTokens = {
    refreshToken: process.env.mailer_refresh_token,
    accessToken: process.env.mailer_access_token,
  };
  keys.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  keys.CLIENT_SITE_URL = process.env.client_site_url;
  keys.ADMIN_SITE_URL = process.env.admin_site_url;
};
switch (process.env.NODE_ENV) {
  case 'PROD': {
    generateConfig(keysProd);
    break;
  }
  case 'DEV': {
    generateConfig(keysDev);
    break;
  }
  case 'TEST': {
    generateConfig(keysTest);
    break;
  }
  default: {
    break;
  }
}

const mongooseOptions = { useNewUrlParser: true, useFindAndModify: false };

module.exports = { keys, mongooseOptions };
