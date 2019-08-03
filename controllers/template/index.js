const Template = require('../../models/template');
const Form = require('../../models/form');
const Workspace = require('../../models/workspace');
const handleResponse = require('../../utils/handleResponse');

const create = (req, res) => {
  const { workspaceId, theme, name } = req.body;
  Workspace.findById(workspaceId)
    .then(workspace => {
      if (handleResponse.notNullObject(workspace, 'workspace', res)) {
        const newTemplate = new Template({ workspaceId, theme, name });
        newTemplate
          .save()
          .then(async template => {
            workspace.templates.push(template.id);
            await workspace.save();
            res.status(201).json(template);
          })
          .catch(err => res.status(400).json(err));
      }
    })
    .catch(err => res.status(400).json(err));
};

const get = (req, res) => {
  Template.findById(req.params.id)
    .then(template => {
      if (handleResponse.notNullObject(template, 'template', res))
        return res.status(200).json(template);
    })
    .catch(err => res.status(400).json(err));
};

const getAllForms = (req, res) => {
  Template.findById(req.params.id)
    .populate('forms')
    .exec()
    .then(template => {
      if (handleResponse.notNullObject(template, 'template', res))
        res.status(200).json(template.forms);
    })
    .catch(err => res.status(400).json(err));
};

const update = (req, res) => {
  const { workspaceId, theme, name, questions, link, forms } = req.body;

  const newTemplate = {
    workspaceId,
    theme,
    name,
    questions,
    link,
    forms,
  };

  Template.findByIdAndUpdate(req.params.id, newTemplate)
    .then(template => {
      if (handleResponse.notNullObject(template, 'template', res))
        res.status(200).json(handleResponse.success);
    })
    .catch(err => res.status(400).json(err));
};

const remove = (req, res) => {
  Template.findByIdAndDelete(req.params.id)
    .then(template => {
      if (handleResponse.notNullObject(template, 'template', res)) {
        Form.deleteMany({ templateId: req.params.id });
        Workspace.updateMany(
          { templates: template.id },
          { $pullAll: { templates: [template.id] } }
        );
        return res.status(200).json(handleResponse.success);
      }
    })
    .catch(err => res.status(400).json(err));
};

module.exports = {
  create,
  get,
  update,
  remove,
  getAllForms,
};
