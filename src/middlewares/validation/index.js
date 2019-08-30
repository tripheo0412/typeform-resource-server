const Joi = require('@hapi/joi');
const isEmpty = require('../../utils/isEmpty');

const validate = schema => (req, res, next) => {
  const options = { abortEarly: false, stripUnknown: true };
  const validation = Joi.validate(req.body, schema, options);
  if (!isEmpty(validation.error))
    return res.status(400).json(validation.error.details);
  next();
};

const signUp = Joi.object().keys({
  fname: Joi.string()
    .alphanum()
    .min(2)
    .max(20)
    .required(),
  lname: Joi.string()
    .alphanum()
    .min(2)
    .max(20)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .regex(/^[a-z0A-Z0-9_]{6,30}$/)
    .required(),
});

const signIn = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9_]{6,30}$/)
    .required(),
});

const theme = Joi.object().keys({
  name: Joi.string().required(),
  font: Joi.string().required(),
  questionColor: Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}/)
    .required(),
  answerColor: Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}/)
    .required(),
  buttonColor: Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}/)
    .required(),
  backgroundColor: Joi.string()
    .regex(/^#[A-Fa-f0-9]{6}/)
    .required(),
  backgroundImage: Joi.string()
    .allow('')
    .allow(null),
});

const question = Joi.object().keys({
  questionType: Joi.string().required(),
  order: Joi.number()
    .integer()
    .required(),
  title: Joi.string().required(),
  choices: Joi.array().items(Joi.object()),
  isRequired: Joi.boolean(),
  description: Joi.string(),
  variant: Joi.string().allow(''),
  image: Joi.string(),
  video: Joi.string(),
});

const answer = Joi.object().keys({
  order: Joi.number()
    .integer()
    .required(),
  value: Joi.array()
    .items(Joi.string())
    .required(),
});

const createWorkspace = Joi.object().keys({
  name: Joi.string().required(),
});

const updateWorkspace = Joi.object().keys({
  _id: Joi.string().required(),
  name: Joi.string().required(),
});

const createTemplate = Joi.object().keys({
  workspaceId: Joi.string().required(),
  name: Joi.string().required(),
});

const updateTemplate = Joi.object().keys({
  _id: Joi.string().required(),
  name: Joi.string().required(),
  questions: Joi.array().items(question),
  theme: Joi.string(),
});

const createForm = Joi.object().keys({
  templateId: Joi.string().required(),
  questions: Joi.array()
    .items(question)
    .required(),
  theme: Joi.object().required(),
});

const addFormResponse = Joi.object().keys({
  response: Joi.array()
    .items(answer)
    .required(),
});

const schemas = {
  signIn,
  signUp,
  theme,
  createWorkspace,
  updateWorkspace,
  createTemplate,
  updateTemplate,
  createForm,
  addFormResponse,
};

module.exports = { validate, schemas };
