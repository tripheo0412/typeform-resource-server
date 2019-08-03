const isEmpty = require('./isEmpty');
const capitalize = require('./capitalize');

const success = { success: true };

const errorTest = new Error('Test');

const objectNotFound = title => {
  const err = `${capitalize(title)} not found`;
  return { error: err };
};

const notNullObject = (object, title, res) => {
  if (isEmpty(object)) {
    res.status(400).json(objectNotFound(title));
    return false;
  }
  return true;
};

module.exports = {
  success,
  errorTest,
  objectNotFound,
  notNullObject,
};
