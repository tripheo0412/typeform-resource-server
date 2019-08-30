const Workspace = require('../../models/workspace');
const User = require('../../models/user');
const Form = require('../../models/form');
const Template = require('../../models/template');
const Authority = require('../../models/authority');
const { ObjectTitle, Rights } = require('../../middlewares/checkAccessRight');
const { success } = require('../../utils/handleResponse');

const create = (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;
  User.findById(userId)
    .then(user => {
      const newWorkspace = {
        name,
        collaborators: [userId],
      };
      Workspace.create(newWorkspace)
        .then(async workspace => {
          user.workspaces.push(workspace.id);
          await user.save();
          await Authority.create({
            objectTitle: ObjectTitle.WORKSPACE,
            objectId: workspace.id,
            userId,
            rights: [
              Rights.CREATE_TEMPLATE,
              Rights.GET,
              Rights.UPDATE,
              Rights.REMOVE,
            ],
          });
          return res.status(201).json(workspace);
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
};

const getWorkspaces = (req, res) => {
  const userId = req.user.id;
  User.findById(userId)
    .populate('workspaces')
    .exec()
    .then(user => {
      res.status(200).json(user.workspaces);
    })
    .catch(err => res.status(400).json(err));
};

const getById = (req, res) => {
  Workspace.findById(req.params.id)
    .then(workspace => res.status(200).json(workspace))
    .catch(err => res.status(400).json(err));
};

const getWorkspaceCollaborators = (req, res) => {
  Workspace.findById(req.params.id)
    .populate('collaborators', 'fname lname profilePicture')
    .exec()
    .then(workspace => res.status(200).json(workspace.collaborators));
};

const getWorkspaceTemplates = (req, res) => {
  Workspace.findById(req.params.id)
    .populate('templates')
    .exec()
    .then(workspace => res.status(200).json(workspace.templates))
    .catch(err => res.status(400).json(err));
};

const update = (req, res) => {
  const { _id, name } = req.body;
  const updatedWorkspace = {
    _id,
    name,
  };
  Workspace.findByIdAndUpdate(_id, updatedWorkspace)
    .then(() => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
};

const remove = (req, res) => {
  const { id } = req.params;
  Workspace.findByIdAndDelete(id)
    .then(async workspace => {
      try {
        await Authority.deleteMany({
          objectTitle: ObjectTitle.WORKSPACE,
          objectId: id,
        });

        await User.updateMany(
          { workspaces: id },
          {
            $pull: { workspaces: id },
          }
        );

        await Template.deleteMany({
          _id: { $in: workspace.templates },
        });
        await Authority.deleteMany({
          objectTitle: ObjectTitle.TEMPLATE,
          objectId: { $in: workspace.templates },
        });

        const forms = await Form.find({
          templateId: { $in: workspace.templates },
        });

        const formIds = [];

        await forms.forEach(form => {
          formIds.push(form.id);
          form.remove();
        });

        await Authority.deleteMany({
          objectTitle: ObjectTitle.FORM,
          objectId: { $in: formIds },
        });

        return res.status(200).json(success);
      } catch (err) {
        return res.status(400).json(err);
      }
    })
    .catch(err => res.status(400).json(err));
};

module.exports = {
  create,
  getWorkspaces,
  getById,
  getWorkspaceCollaborators,
  getWorkspaceTemplates,
  update,
  remove,
};
