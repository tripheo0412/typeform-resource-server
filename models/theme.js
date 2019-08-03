const mongoose = require('mongoose');

const { Schema } = mongoose;

const ThemeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    name: {
      type: String,
      required: true,
    },
    isPublic: { type: Boolean, default: false },
    font: { type: String, default: 'Open Sans' },
    questionColor: { type: String, default: '#3D3D3D' },
    answerColor: { type: String, default: '#4FB0AE' },
    buttonColor: { type: String, default: ' #4FB0AE' },
    backgroundColor: { type: String, default: '#FFFFFF' },
    backgroundImage: String,
  },
  { timestamps: true }
);

const Theme = mongoose.model('Themes', ThemeSchema);

module.exports = Theme;
