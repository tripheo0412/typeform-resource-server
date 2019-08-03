const { keys } = require('../../config');

const generateURL = email =>
  email.slice(0, email.indexOf('@')).concat(`.${keys.DOMAIN}`);
module.exports = generateURL;
