const express = require('express');
const passport = require('passport');
const Controller = require('../../controllers/theme');
const { validate, schemas } = require('../../middlewares/validation');

const passportJwt = passport.authenticate('jwt', { session: false });

const router = express.Router();

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
router
  .route('/')
  .post(validate(schemas.theme), passportJwt, Controller.newTheme);

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
router.route('/public').get(passportJwt, Controller.getPublicTheme);

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
router.route('/').get(passportJwt, Controller.getUserThemes);

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
router.route('/:id').get(passportJwt, Controller.getThemeById);

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
router
  .route('/')
  .put(validate(schemas.theme), passportJwt, Controller.updateTheme);

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
router.route('/:id').delete(passportJwt, Controller.deleteTheme);

module.exports = router;
