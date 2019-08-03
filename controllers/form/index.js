const Form = require('../../models/form');
const Template = require('../../models/template');
const handleResponse = require('../../utils/handleResponse');

const create = (req, res) => {
  const { templateURL, templateId, questions } = req.body;
  Template.findById(templateId)
    .then(template => {
      if (handleResponse.notNullObject(template, 'template', res)) {
        const newForm = new Form({ templateId, questions });
        newForm
          .save()
          .then(async form => {
            template.link = `${templateURL}/forms/${form.shortId}`;
            template.forms.push(form.id);
            await template.save();
            return res.status(201).json(form);
          })
          .catch(err => res.status(400).json(err));
      }
    })
    .catch(err => res.status(400).json(err));
};

const get = (req, res) => {
  Form.findOne({ shortId: req.params.shortId })
    .then(form => {
      if (handleResponse.notNullObject(form, 'form', res))
        return res.status(200).json(form);
    })
    .catch(err => res.status(400).json(err));
};

const update = (req, res) => {
  const { response } = req.body;
  Form.findOne({ shortId: req.params.shortId })
    .then(async form => {
      if (handleResponse.notNullObject(form, 'form', res)) {
        form.responses.push(response);
        await form.save();
        return res.status(200).json(handleResponse.success);
      }
    })
    .catch(err => res.status(400).json(err));
};

const remove = (req, res) => {
  Form.findByIdAndDelete(req.params.id)
    .then(form => {
      if (handleResponse.notNullObject(form, 'form', res)) {
        Template.updateMany(
          { forms: form.id },
          { $pullAll: { forms: [form.id] } }
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
};
