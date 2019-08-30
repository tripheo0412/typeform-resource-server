const express = require('express');
const passport = require('passport');
const Controller = require('../controllers/form');
const { validate, schemas } = require('../middlewares/validation');
const {
  checkAccessRight,
  ObjectTitle,
  Rights,
} = require('../middlewares/checkAccessRight');

const passportJwt = passport.authenticate('jwt', { session: false });

const router = express.Router();

router
  .route('/')
  .post(
    validate(schemas.createForm),
    passportJwt,
    checkAccessRight(ObjectTitle.TEMPLATE, Rights.CREATE_FORM),
    Controller.create
  );

router.route('/:shortId').get(Controller.getByShortId);

router
  .route('/:shortId')
  .patch(validate(schemas.addFormResponse), Controller.addResponse);

router
  .route('/:id')
  .delete(
    passportJwt,
    checkAccessRight(ObjectTitle.FORM, Rights.REMOVE),
    Controller.remove
  );

module.exports = router;
