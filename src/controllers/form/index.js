const Form = require('../../models/form');
const Template = require('../../models/template');
const Authority = require('../../models/authority');
const { ObjectTitle, Rights } = require('../../middlewares/checkAccessRight');
const { success, objectNotFound } = require('../../utils/handleResponse');
const { mail, transporter } = require('../../utils/mailer');
const isEmpty = require('../../utils/isEmpty');

const create = (req, res) => {
  const userId = req.user.id;
  const { templateURL } = req.user;
  const { templateId, questions, theme } = req.body;
  Template.findById(templateId)
    .then(template => {
      const newForm = new Form({
        templateId,
        questions,
        theme,
      });
      newForm
        .save()
        .then(async form => {
          form.link = `${templateURL}/${form.shortId}`;
          await form.save();
          template.forms.push(form.id);
          await template.save();
          await Authority.create({
            objectTitle: ObjectTitle.FORM,
            objectId: form.id,
            userId,
            rights: [Rights.GET, Rights.REMOVE],
          });
          return res.status(201).json(form);
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
};

const getByShortId = (req, res) => {
  Form.findOne({ shortId: req.params.shortId })
    .then(form => {
      if (isEmpty(form))
        return res.status(404).json(objectNotFound(ObjectTitle.FORM));
      return res.status(200).json(form);
    })
    .catch(err => res.status(400).json(err));
};

const addResponse = (req, res) => {
  const { response } = req.body;
  Form.findOne({ shortId: req.body.shortId })
    .then(async form => {
      if (isEmpty(form))
        return res.status(404).json(objectNotFound(ObjectTitle.FORM));
      form.responses.push(response);
      await form.save();

      const template = await Template.findById(form.templateId);
      template.responses += 1;
      await template.save();
      if (template.emailNotification.isEnable) {
        const mailOptions = mail;
        mailOptions.subject = template.emailNotification.subject;
        mailOptions.to = template.emailNotification.receiver;
        mailOptions.context = {
          template_name: template.name,
          action_url: 'https://typeform-tripheo0412.netlify.com/',
        };
        mailOptions.template = 'notification';
        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(mailOptions);
            console.log(`Email sent: ${info.response}`);
          }
        });
        return res.status(200).json(success);
      }
    })
    .catch(err => res.status(400).json(err));
};

const remove = (req, res) => {
  const { id } = req.params;
  Form.findByIdAndDelete(id)
    .then(async form => {
      await Authority.deleteMany({
        objectTitle: ObjectTitle.FORM,
        objectId: id,
      });
      await Template.updateOne(
        { forms: form.id },
        { $pull: { forms: form.id } }
      );
      return res.status(200).json(success);
    })
    .catch(err => res.status(400).json(err));
};

module.exports = {
  create,
  getByShortId,
  addResponse,
  remove,
};
