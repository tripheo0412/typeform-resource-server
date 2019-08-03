const express = require('express');
const passport = require('passport');

const router = express.Router();
const userController = require('../../controllers/user');
const { validate, schemas } = require('../../middlewares/validation');

router.route('/signup').post(validate(schemas.signUp), userController.signUp);

router
  .route('/')
  .get(
    passport.authenticate('jwt', { session: false }),
    userController.getUser
  );

router
  .route('/')
  .patch(
    passport.authenticate('jwt', { session: false }),
    userController.updateProfile
  );

router
  .route('/')
  .delete(
    passport.authenticate('jwt', { session: false }),
    userController.deleteUser
  );
module.exports = router;
