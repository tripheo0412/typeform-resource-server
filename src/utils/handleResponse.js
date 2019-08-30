const capitalize = require('./capitalize');

const success = { success: true };

const objectNotFound = title => {
  const err = `${capitalize(title)} not found`;
  return { error: err };
};

module.exports = {
  success,
  objectNotFound,
};
