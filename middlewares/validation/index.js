const Joi = require('@hapi/joi');
const isEmpty = require('../../utils/isEmpty');

const validate = schema => (req, res, next) => {
  const options = { abortEarly: false, stripUnknown: true };
  const validation = Joi.validate(req.body, schema, options);
  if (!isEmpty(validation.error))
    return res.status(400).json(validation.error.details);
  next();
};

const signIn = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9_]{6,30}$/)
    .required(),
});

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

const question = Joi.object().keys({
  questionType: Joi.string().required(),
  order: Joi.number()
    .integer()
    .required(),
  title: Joi.string().required(),
  choices: Joi.array().items(Joi.object()),
  isRequired: Joi.boolean(),
  description: Joi.string(),
  image: Joi.string(),
  video: Joi.string(),
});

const template = Joi.object().keys({
  name: Joi.string().required(),
  link: Joi.string(),
  questions: Joi.array().items(question),
  lastModified: Joi.date(),
});

const workspace = Joi.object().keys({
  name: Joi.string().required(),
});

const theme = Joi.object().keys({
  name: Joi.string().required(),
  isPublic: Joi.boolean().required(),
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
  backgroundColor: Joi.string().regex(/^#[A-Fa-f0-9]{6}/),
  backgroundImage: Joi.string(),
  lastModified: Joi.date(),
});

const createForm = Joi.object().keys({
  templateURL: Joi.string().required(),
  templateId: Joi.string().required(),
  questions: Joi.array()
    .items(question)
    .required(),
  responses: Joi.array().items(Joi.array().items(Joi.object())),
});

const updateForm = Joi.object().keys({
  response: Joi.array()
    .items(Joi.object())
    .required(),
});

const schemas = {
  signIn,
  signUp,
  template,
  workspace,
  theme,
  createForm,
  updateForm,
};

module.exports = { validate, schemas };
