const mongoose = require('mongoose');
const QuestionSchema = require('./question');

const { Schema } = mongoose;

const TemplateSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspaces',
      required: true,
    },
    theme: { type: Schema.Types.ObjectId, ref: 'Themes' },
    name: {
      type: String,
      required: true,
    },
    questions: [QuestionSchema],
    emailNotification: {
      isEnable: { type: Boolean, default: false },
      subject: String,
      receiver: [String],
    },
    forms: [{ type: Schema.Types.ObjectId, ref: 'Forms' }],
    responses: { type: Schema.Types.Number, default: 0 },
  },
  { timestamps: true }
);

const Template = mongoose.model('Templates', TemplateSchema);

module.exports = Template;
