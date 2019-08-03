const Theme = require('../../models/theme');
const User = require('../../models/user');
const Template = require('../../models/template');
const handleResponse = require('../../utils/handleResponse');

module.exports = {
  // Create new theme
  newTheme: (req, res) => {
    const {
      isPublic,
      font,
      questionColor,
      answerColor,
      buttonColor,
      backgroundColor,
      backgroundImage,
      name,
    } = req.body;
    const userId = req.user._id;
    User.findById(userId)
      .then(user => {
        if (handleResponse.notNullObject(user, 'user', res)) {
          const newTheme = {
            isPublic,
            font,
            questionColor,
            answerColor,
            buttonColor,
            backgroundColor,
            name,
            backgroundImage,
          };
          Theme.create(newTheme)
            .then(async theme => {
              user.themes.push(theme.id);
              await user.save();
              res.status(201).json(theme);
            })
            .catch(err => res.status(400).json(err));
        }
      })
      .catch(err => res.status(400).json(err));
  },

  // Get all themes that belong to a user
  getUserThemes: (req, res) => {
    const userId = req.user._id;
    User.findById(userId, 'id')
      .populate('themes')
      .exec()
      .then(user => {
        if (handleResponse.notNullObject(user, 'user', res))
          res.status(200).json(user.themes);
      })
      .catch(err => res.status(400).json(err));
  },

  // Get theme by id
  getThemeById: (req, res) => {
    Theme.findById(req.params.id)
      .then(theme => {
        if (handleResponse.notNullObject(theme, 'theme', res))
          return res.status(200).json(theme);
      })
      .catch(err => res.status(400).json(err));
  },

  // Get public themes
  getPublicTheme: (req, res) => {
    Theme.find({ isPublic: 'true' })
      .then(themes => {
        if (handleResponse.notNullObject(themes, 'themes', res))
          return res.status(200).json(themes);
      })
      .catch(err => res.status(400).json(err));
  },

  // Update theme
  updateTheme: (req, res) => {
    const id = req.body._id;
    const {
      isPublic,
      font,
      questionColor,
      answerColor,
      buttonColor,
      backgroundColor,
      backgroundImage,
      name,
    } = req.body;
    const updatedTheme = {
      isPublic,
      font,
      questionColor,
      answerColor,
      buttonColor,
      backgroundColor,
      name,
      backgroundImage,
    };
    Theme.findByIdAndUpdate(id, updatedTheme)
      .then(theme => {
        if (handleResponse.notNullObject(theme, 'theme', res))
          return res.status(200).json(handleResponse.success);
      })
      .catch(err => res.status(400).json(err));
  },

  // Delete theme
  deleteTheme: (req, res) => {
    const themeId = req.params.id;
    const userId = req.user._id;
    Theme.findByIdAndDelete(themeId)
      .then(theme => {
        if (handleResponse.notNullObject(theme, 'theme', res)) {
          User.updateOne(
            { _id: userId },
            {
              $pullAll: { themes: [themeId] },
            },
            err => {
              if (err) return res.status(400).json(err);
            }
          );
          const publicTheme = Theme.findOne({ isPublic: true })
            .then(() => {
              Template.updateMany(
                { theme: themeId },
                { theme: publicTheme._id },
                err => {
                  if (err) return res.status(400).json(err);
                }
              );
              return res.status(200).json(handleResponse.success);
            })
            .catch(err => res.status(400).json(err));
        }
      })
      .catch(err => res.status(400).json(err));
  },
};
