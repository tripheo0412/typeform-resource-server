const express = require('express');
const passport = require('passport');
const Controller = require('../controllers/workspace');
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
  .post(validate(schemas.createWorkspace), passportJwt, Controller.create);

router.route('/').get(passportJwt, Controller.getWorkspaces);

router
  .route('/:id')
  .get(
    passportJwt,
    checkAccessRight(ObjectTitle.WORKSPACE, Rights.GET),
    Controller.getById
  );

router
  .route('/:id/collaborators')
  .get(
    passportJwt,
    checkAccessRight(ObjectTitle.WORKSPACE, Rights.GET),
    Controller.getWorkspaceCollaborators
  );

router
  .route('/:id/templates')
  .get(
    passportJwt,
    checkAccessRight(ObjectTitle.WORKSPACE, Rights.GET),
    Controller.getWorkspaceTemplates
  );

router
  .route('/')
  .put(
    validate(schemas.updateWorkspace),
    passportJwt,
    checkAccessRight(ObjectTitle.WORKSPACE, Rights.UPDATE),
    Controller.update
  );

router
  .route('/:id')
  .delete(
    passportJwt,
    checkAccessRight(ObjectTitle.WORKSPACE, Rights.REMOVE),
    Controller.remove
  );

module.exports = router;

/**
 * @apiDefine WorkspaceNotFoundError
 *
 * @apiError WorkspaceNotFound The id of the Workspace was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "WorkspaceNotFound"
 *     }
 */

/**
 * @apiDefine WorkspaceCreatedError
 *
 * @apiError WorkspaceCreatedError Check response for error's information.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": err object
 *     }
 */

/**
 * @api {post} /workspaces Create new Workspace
 * @apiName PostNewWorkspace
 * @apiGroup Workspace
 *
 * @apiParam {String} [name] Name of the Workspace.
 * @apiParam {String} [adminIds] Id of the creator(s?) of the Workspace.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 New workspace created.
 *
 * @apiUse WorkspaceCreatedError
 */

/**
 * @api {get} /workspaces/user/:id Get Workspace by user Id
 * @apiName GetUserWorkspaces
 * @apiGroup Workspace
 *
 * @apiParam {String} _id   User ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [{
 *          success : List of that user's workspaces and user id
 *      }]
 * @apiUse UserNotFoundError
 */

/**
 * @api {get} /workspaces/:id Get workspace content: templates and collaborators by workspace id
 * @apiName GetWorkspaceById
 * @apiGroup Workspace
 *
 * @apiParam {String} _id   Workspace unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [{
 *          success : Workspace item
 *      }]
 * @apiUse WorkspaceNotFoundError
 */

/**
 * @api {put} /workspaces/ Modify Workspace information
 * @apiName PutWorkspace
 * @apiGroup Workspace
 *
 * @apiParam {String} [_id]                   Workspaces unique ID.
 * @apiParam {String} [name]                Name of the Workspace.
 * @apiParam {String} [adminIds]            Admin(s) of the Workspace.
 * @apiParam {String} [collaborators]     Collaborators of the Workspace.
 * @apiParam {String} [templates]         Templates that Workspace contains.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [{
 *          success : "Workspace editted"
 *      }]
 * @apiUse WorkspaceNotFoundError
 */

/**
 * @api {delete} /workspaces/:id Delete Workspace
 * @apiName DeleteWorkspace
 * @apiGroup Workspace
 *
 * @apiParam {String} _id   Workspaces unique ID.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      [{
 *          success : "Workspace deleted"
 *      }]
 * @apiUse WorkspaceNotFoundError
 */
