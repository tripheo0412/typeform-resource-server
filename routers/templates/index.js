const express = require('express');
const passport = require('passport');
const Controller = require('../../controllers/template');
const { validate, schemas } = require('../../middlewares/validation');

const passportJwt = passport.authenticate('jwt', { session: false });

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
const router = express.Router();

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
router
  .route('/')
  .post(validate(schemas.template), passportJwt, Controller.create);

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
router.route('/:id').get(passportJwt, Controller.get);

router.route('/:id/forms').get(passportJwt, Controller.getAllForms);

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
router
  .route('/:id')
  .put(validate(schemas.template), passportJwt, Controller.update);

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
router.route('/:id').delete(passportJwt, Controller.remove);

module.exports = router;
