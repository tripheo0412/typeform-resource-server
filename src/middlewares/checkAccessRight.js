const Authority = require('../models/authority');
const isEmpty = require('../utils/isEmpty');
const { objectNotFound } = require('../utils/handleResponse');

const ObjectTitle = Object.freeze({
  WORKSPACE: 'workspace',
  TEMPLATE: 'template',
  FORM: 'form',
  THEME: 'theme',
});

const Rights = Object.freeze({
  CREATE_TEMPLATE: 'create_template',
  CREATE_FORM: 'create_form',
  GET: 'get',
  UPDATE: 'update',
  REMOVE: 'remove',
});

const checkAccessRight = (objectTitle, action) => (req, res, next) => {
  const userId = req.user.id;
  let objectId;

  switch (action) {
    case Rights.CREATE_TEMPLATE:
      objectId = req.body.workspaceId;
      break;
    case Rights.CREATE_FORM:
      objectId = req.body.templateId;
      break;
    default:
      objectId = req.body._id || req.params.id;
  }

  Authority.find({ objectTitle, objectId }).then(queries => {
    if (isEmpty(queries))
      return res.status(404).json(objectNotFound(objectTitle));

    queries.forEach(query => {
      if (query.userId.toString() === userId && query.rights.includes(action)) {
        next();
      } else {
        return res.status(403).json({ error: 'Access denied' });
      }
    });
  });
};

module.exports = { ObjectTitle, Rights, checkAccessRight };
