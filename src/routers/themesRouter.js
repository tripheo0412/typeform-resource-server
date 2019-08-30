const express = require('express');
const passport = require('passport');
const Controller = require('../controllers/theme');
const { validate, schemas } = require('../middlewares/validation');
const {
  checkAccessRight,
  ObjectTitle,
  Rights,
} = require('../middlewares/checkAccessRight');

const router = express.Router();

const passportJwt = passport.authenticate('jwt', { session: false });

router
  .route('/public')
  .post(validate(schemas.theme), Controller.createPublicTheme);

router.route('/public').get(passportJwt, Controller.getPublicThemes);

router.route('/').post(validate(schemas.theme), passportJwt, Controller.create);

router.route('/').get(passportJwt, Controller.getUserThemes);

router
  .route('/:id')
  .get(
    passportJwt,
    checkAccessRight(ObjectTitle.THEME, Rights.GET),
    Controller.getById
  );

router
  .route('/')
  .put(
    validate(schemas.theme),
    passportJwt,
    checkAccessRight(ObjectTitle.THEME, Rights.UPDATE),
    Controller.update
  );

router
  .route('/:id')
  .delete(
    passportJwt,
    checkAccessRight(ObjectTitle.THEME, Rights.REMOVE),
    Controller.remove
  );

module.exports = router;

/**
 * @apiDefine ThemeNotFoundError
 *
 * @apiError ThemeNotFound The id of the Theme was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ThemeNotFound"
 *     }
 */
/**
 * @apiDefine ThemeCreatedError
 *
 * @apiError ThemeCreatedError Check response for error's information.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": err object
 *     }
 */

/**
 * @api {post} /themes/ Create new Theme
 * @apiName PostNewTheme
 * @apiGroup Theme
 *
 * @apiParam {String} [name]            Name of the Theme.
 * @apiParam {Boolean} [isPublic]       Is the theme public
 * @apiParam {String} [font]            Theme font
 * @apiParam {String} [questionColor]   Question color
 * @apiParam {String} [answerColor]     Answer color
 * @apiParam {String} [buttonColor]     Button color
 * @apiParam {String} [backgroundColor] Background color
 * @apiParam {String} [backgroundImage] Background image
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 New Theme created.
 *
 * @apiUse ThemeCreatedError
 */

/**
 * @api {get} /themes/public Get all public Theme
 * @apiName GetPublicTheme
 * @apiGroup Theme
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [{
 *          success : Themes array
 *      }]
 * @apiUse ThemeNotFoundError
 */

/**
 * @api {get} /themes/user/:id Get all user's personal themes
 * @apiName GetUserThemes
 * @apiGroup Theme
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [{
 *          success : Themes array and user id
 *      }]
 * @apiUse ThemeNotFoundError
 */

/**
 * @api {get} /themes/:id Get Theme By Id
 * @apiName GetThemeById
 * @apiGroup Theme
 *
 * @apiParam {String} _id   Themes unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [{
 *          success : Theme object
 *      }]
 * @apiUse ThemeNotFoundError
 */

/**
 * @api {put} /themes/ Modify Theme information
 * @apiName PutTheme
 * @apiGroup Theme
 *
 * @apiParam {String} [name]            Name of the Theme.
 * @apiParam {Boolean}[isPublic]        Is the theme public
 * @apiParam {String} [font]            Theme font
 * @apiParam {String} [questionColor]   Question color
 * @apiParam {String} [answerColor]     Answer color
 * @apiParam {String} [buttonColor]     Button color
 * @apiParam {String} [backgroundColor] Background color
 * @apiParam {String} [backgroundImage] Background image
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [{
 *          success : "Theme updated"
 *      }]
 * @apiUse ThemeNotFoundError
 */

/**
 * @api {delete} /themes/:id Delete Theme
 * @apiName DeleteTheme
 * @apiGroup Theme
 *
 * @apiParam {String} _id   Themes unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [{
 *          success : "Theme deleted"
 *      }]
 * @apiUse ThemeNotFoundError
 */
