const Workspace = require('../../models/workspace');
const User = require('../../models/user');
const Form = require('../../models/form');
const Template = require('../../models/template');
const handleResponse = require('../../utils/handleResponse');

module.exports = {
  // Add new workspace to user
  newWorkspace: (req, res) => {
    const { name } = req.body;
    const userId = req.user._id;
    User.findById(userId)
      .then(user => {
        if (handleResponse.notNullObject(user, 'user', res)) {
          const newWorkspace = {
            adminIds: [userId],
            collaborators: [], // new workspace should only have one user -> the creator
            templates: [], // new workspace should have no template
            name,
          };
          Workspace.create(newWorkspace)
            .then(async workspace => {
              user.workspaces.push(workspace.id);
              await user.save();
              res.status(201).json(workspace);
            })
            .catch(err => res.status(400).json(err));
        }
      })
      .catch(err => res.status(400).json(err));
  },
  // Get all workspaces of the logged in user
  getUserWorkspaces: (req, res) => {
    const userId = req.user._id;
    User.findById(userId, 'id')
      .populate('workspaces')
      .exec()
      .then(user => {
        if (handleResponse.notNullObject(user, 'user', res))
          res.status(200).json(user.workspaces);
      })
      .catch(err => res.status(400).json(err));
  },

  // Get workspace content: templates and collaborators by Id
  getWorkspaceContent: (req, res) => {
    Workspace.findById(req.params.id)
      .populate({
        path: 'templates',
        // select: 'name link questions forms createdAt updatedAt',
        populate: { path: 'theme' },
      })
      .populate('collaborators', 'fname lname role profilePicture')
      .exec()
      .then(workspace => {
        if (handleResponse.notNullObject(workspace, 'workspace', res))
          res.status(200).json(workspace);
      })
      .catch(err => res.status(400).json(err));
  },

  // Edit workspace
  updateWorkspace: (req, res) => {
    const { _id, adminIds, collaborators, templates, name } = req.body;
    const updatedWorkspace = {
      _id,
      adminIds,
      collaborators,
      templates,
      name,
    };
    Workspace.findByIdAndUpdate(_id, updatedWorkspace, { new: true })
      .then(workspace => {
        if (handleResponse.notNullObject(workspace, 'workspace', res))
          return res.status(200).json(handleResponse.success);
      })
      .catch(err => res.status(400).json(err));
  },

  // Delete workspace
  deleteWorkspace: (req, res) => {
    const workspaceId = req.params.id;
    Workspace.findById(workspaceId)
      .then(workspace => {
        if (handleResponse.notNullObject(workspace, 'workspace', res)) {
          Form.deleteMany({ templateId: { $in: workspace.templates } })
            .then(() =>
              Template.deleteMany({ _id: { $in: workspace.templates } })
            )
            .then(() => workspace.deleteOne())
            .then(() =>
              User.updateMany(
                { workspaces: workspaceId },
                {
                  $pullAll: { workspaces: [workspaceId] },
                }
              )
            )
            .then(() => res.status(200).json(handleResponse.success))
            .catch(err => res.status(400).json(err));
        }
      })
      .catch(err => res.status(400).json(err));
  },
};
