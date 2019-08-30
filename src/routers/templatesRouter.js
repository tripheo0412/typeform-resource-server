const express = require('express');
const passport = require('passport');
const Controller = require('../controllers/template');
const { validate, schemas } = require('../middlewares/validation');
const {
  checkAccessRight,
  ObjectTitle,
  Rights,
} = require('../middlewares/checkAccessRight');

const router = express.Router();

const passportJwt = passport.authenticate('jwt', { session: false });

router
  .route('/')
  .post(
    validate(schemas.createTemplate),
    passportJwt,
    checkAccessRight(ObjectTitle.WORKSPACE, Rights.CREATE_TEMPLATE),
    Controller.create
  );

router
  .route('/:id')
  .get(
    passportJwt,
    checkAccessRight(ObjectTitle.TEMPLATE, Rights.GET),
    Controller.getById
  );

router
  .route('/:id/forms')
  .get(
    passportJwt,
    checkAccessRight(ObjectTitle.TEMPLATE, Rights.GET),
    Controller.getTemplateForms
  );

router
  .route('/:id/theme')
  .get(
    passportJwt,
    checkAccessRight(ObjectTitle.TEMPLATE, Rights.GET),
    Controller.getTemplateTheme
  );

router
  .route('/')
  .put(
    validate(schemas.updateTemplate),
    passportJwt,
    checkAccessRight(ObjectTitle.TEMPLATE, Rights.UPDATE),
    Controller.update
  );

router
  .route('/:id')
  .delete(
    passportJwt,
    checkAccessRight(ObjectTitle.TEMPLATE, Rights.REMOVE),
    Controller.remove
  );
router
  .route('/:id')
  .put(
    passportJwt,
    checkAccessRight(ObjectTitle.TEMPLATE, Rights.UPDATE),
    Controller.updateEmailNotification
  );
module.exports = router;

/**
 * @apiDefine TemplateNotFoundError
 *
 * @apiError TemplateNotFound Cannot find template with that id
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "TemplateNotFound"
 *     }
 */

/**
 * @apiDefine TemplateCreatedError
 *
 * @apiError TemplateCreatedError Check response for error
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *          "message": "\"name\" is required",
 *          "path": [
 *              "name"
 *          ],
 *          "type": "any.required",
 *          "context": {
 *              "key": "name",
 *              "label": "name"
 *          }
 *      }
 */

/**
 * @api {post} /templates/ Create new template
 * @apiName PostNewTemplate
 * @apiGroup Template
 *
 * @apiParam {String} [name] Name of template
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *      "id": "1",
 *      "name": "My template",
 *      "link": "https://template/abcdef13579"
 *      "questions": [],
 *      "formIds" [],
 *      "themeId": ["123"],
 *      "lastModified": 2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }
 *
 * @apiUse TemplateCreatedError
 */

/**
 * @api {get} /templates/ Get template
 * @apiName GetTemplate
 * @apiGroup Template
 *
 * @apiParam {String} [id] Id of template
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [{
 *      "id": "1",
 *      "name": "My template",
 *      "link": "https://template/abcdef13579"
 *      "questions": [],
 *      "formIds" [],
 *      "themeId": ["123"],
 *      "lastModified": 2016-02-10T15:46:51.778Z",
 *      "created_at": "2016-02-10T15:46:51.778Z"
 *    }]
 * @apiUse TemplateNotFoundError
 */

/**
 * @api {patch} /templates/ Update template
 * @apiName PatchTemplate
 * @apiGroup Template
 *
 * @apiParam {String} [name] Name of template
 * @apiParam {String} [link] Link of template
 * @apiParam {Array} [questions] Questions of template
 * @apiParam {String} [formIds] Response versions of template
 * @apiParam {String} [themeId] Theme of template
 * @apiParam {Date} [lastModified] Last modified time of template
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "true"
 *     }
 * @apiUse TemplateNotFoundError
 */

/**
 * @api {delete} /templates/:id Delete template
 * @apiName DeleteTemplate
 * @apiGroup Template
 *
 * @apiParam {String} [id] Id of template
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "true"
 *     }
 * @apiUse TemplateNotFoundError
 */
