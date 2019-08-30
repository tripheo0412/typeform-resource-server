const mongoose = require('mongoose');

const { Schema } = mongoose;

const ThemeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isPublic: { type: Boolean, required: true },
    font: { type: String, required: true },
    questionColor: { type: String, required: true },
    answerColor: { type: String, required: true },
    buttonColor: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    backgroundImage: String,
  },
  { timestamps: true }
);

const Theme = mongoose.model('Themes', ThemeSchema);

module.exports = Theme;
