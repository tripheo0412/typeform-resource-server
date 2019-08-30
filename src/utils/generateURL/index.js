const { keys } = require('../../config');

const generateURL = email =>
  email.slice(0, email.indexOf('@')).concat(`.${keys.CLIENT_SITE_URL}`);
module.exports = generateURL;
