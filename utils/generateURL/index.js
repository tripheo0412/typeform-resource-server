const { keys } = require('../../config');

const generateURL = email =>
  email.slice(0, email.indexOf('@')).concat(`.${process.env.DOMAIN}`);
module.exports = generateURL;
