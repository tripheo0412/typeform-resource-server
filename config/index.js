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
};
switch (process.env.NODE_ENV) {
  case 'PROD': {
    generateConfig(keysProd);
    break;
  }
  case 'production': {
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
