const mongoose = require('mongoose');
const shortid = require('shortid');
const isEmpty = require('../utils/isEmpty');
const QuestionSchema = require('./question');

const { Schema } = mongoose;

const FormSchema = new Schema(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Templates',
      required: true,
    },
    shortId: {
      type: String,
      default: shortid.generate,
    },
    link: {
      type: String,
    },
    questions: {
      type: [QuestionSchema],
      validate: questions => !isEmpty(questions),
    },
    responses: [
      [
        {
          order: { type: Number, required: true },
          value: [String],
        },
      ],
    ],
    theme: { type: Object, required: true },
    emailNotification: {
      isEnable: { type: Boolean, default: false },
      subject: String,
      receiver: [String],
      message: {
        name: String,
        resultLink: String,
      },
    },
  },
  { timestamps: true }
);

const Form = mongoose.model('Forms', FormSchema);

module.exports = Form;
