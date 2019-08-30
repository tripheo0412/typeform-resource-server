const Template = require('../../models/template');
const Form = require('../../models/form');
const Workspace = require('../../models/workspace');
const Theme = require('../../models/theme');
const Authority = require('../../models/authority');
const { ObjectTitle, Rights } = require('../../middlewares/checkAccessRight');
const { success } = require('../../utils/handleResponse');

const create = (req, res) => {
  const userId = req.user.id;
  const { workspaceId, name, theme, questions } = req.body;
  Workspace.findById(workspaceId)
    .then(async workspace => {
      const publicTheme = await Theme.findOne({ isPublic: true });
      const newTemplate = new Template({
        workspaceId,
        theme: theme || publicTheme.id,
        name,
        questions: questions || [],
      });
      newTemplate
        .save()
        .then(async template => {
          workspace.templates.push(template.id);
          await workspace.save();
          await Authority.create({
            objectTitle: ObjectTitle.TEMPLATE,
            objectId: template.id,
            userId,
            rights: [
              Rights.CREATE_FORM,
              Rights.GET,
              Rights.UPDATE,
              Rights.REMOVE,
            ],
          });
          res.status(201).json(template);
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
};

const getById = (req, res) => {
  Template.findById(req.params.id)
    .then(template => res.status(200).json(template))
    .catch(err => res.status(400).json(err));
};

const getTemplateForms = (req, res) => {
  Template.findById(req.params.id)
    .populate('forms')
    .exec()
    .then(template => res.status(200).json(template.forms))
    .catch(err => res.status(400).json(err));
};

const getTemplateTheme = (req, res) => {
  Template.findById(req.params.id)
    .populate('theme')
    .exec()
    .then(template => res.status(200).json(template.theme))
    .catch(err => res.status(400).json(err));
};

const update = (req, res) => {
  const { _id, theme, name, questions } = req.body;

  const newTemplate = {
    _id,
    theme,
    name,
    questions,
  };

  Template.findByIdAndUpdate(_id, newTemplate)
    .then(() => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
};

const remove = (req, res) => {
  const { id } = req.params;
  Template.findByIdAndDelete(id)
    .then(async template => {
      try {
        await Authority.deleteMany({
          objectTitle: ObjectTitle.TEMPLATE,
          objectId: id,
        });
        await Workspace.updateOne(
          { templates: template.id },
          { $pull: { templates: template.id } }
        );
        await Form.deleteMany({ templateId: template.id });
        await Authority.deleteMany({
          objectTitle: ObjectTitle.FORM,
          objectId: { $in: template.forms },
        });

        return res.status(200).json(success);
      } catch (err) {
        return res.status(400).json(err);
      }
    })
    .catch(err => res.status(400).json(err));
};

const updateEmailNotification = async (req, res) => {
  try {
    const { id, isEnable, receiver, subject } = req.body;
    const template = await Template.findById(id);
    template.emailNotification = {
      isEnable,
      subject,
      receiver,
    };
    await template.save();
    res.status(200).json(success);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  create,
  getById,
  getTemplateForms,
  getTemplateTheme,
  update,
  remove,
  updateEmailNotification,
};
