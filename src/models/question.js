const mongoose = require('mongoose');

const { Schema } = mongoose;

const QuestionSchema = new Schema({
  questionType: { type: String, required: true },
  order: { type: Number, required: true },
  title: { type: String, required: true },
  variant: String,
  description: String,
  image: String,
  video: String,
  choices: [
    {
      order: { type: Number, required: true },
      value: { type: String, required: true },
      text: { type: String },
    },
  ],
  isRequired: { type: Boolean, default: false },
  steps: { type: Number },
});

module.exports = QuestionSchema;
