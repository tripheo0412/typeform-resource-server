const mongoose = require('mongoose');
const QuestionSchema = require('./question');

const { Schema } = mongoose;

const TemplateSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspaces' },
    theme: { type: Schema.Types.ObjectId, ref: 'Themes' },
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    questions: [QuestionSchema],
    forms: [{ type: Schema.Types.ObjectId, ref: 'Forms' }],
  },
  { timestamps: true }
);

const Template = mongoose.model('Templates', TemplateSchema);

module.exports = Template;
