const express = require('express');
const passport = require('passport');
const Controller = require('../../controllers/form');
const { validate, schemas } = require('../../middlewares/validation');

const passportJwt = passport.authenticate('jwt', { session: false });

const router = express.Router();

router
  .route('/')
  .post(validate(schemas.createForm), passportJwt, Controller.create);

router.route('/:shortId').get(Controller.get);

router
  .route('/:shortId')
  .patch(validate(schemas.updateForm), Controller.update);

router.route('/:id').delete(passportJwt, Controller.remove);

module.exports = router;
