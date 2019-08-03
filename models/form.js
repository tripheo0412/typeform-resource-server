const mongoose = require('mongoose');
const shortid = require('shortid');
const isEmpty = require('../utils/isEmpty');
const QuestionSchema = require('./question');

const { Schema } = mongoose;

const FormSchema = new Schema({
  templateId: { type: Schema.Types.ObjectId, ref: 'Templates', required: true },
  shortId: {
    type: String,
    default: shortid.generate,
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
});

const Form = mongoose.model('Forms', FormSchema);

module.exports = Form;
