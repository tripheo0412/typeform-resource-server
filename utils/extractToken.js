const extractToken = cookie =>
  cookie.slice(cookie.indexOf('=') + 1, cookie.indexOf(';'));

module.exports = extractToken;
