const Theme = require('../../models/theme');
const User = require('../../models/user');
const Template = require('../../models/template');
const Authority = require('../../models/authority');
const { ObjectTitle, Rights } = require('../../middlewares/checkAccessRight');
const { success } = require('../../utils/handleResponse');

// TODO: Make this only for admin users
const createPublicTheme = (req, res) => {
  const {
    font,
    questionColor,
    answerColor,
    buttonColor,
    backgroundColor,
    backgroundImage,
    name,
  } = req.body;

  const newTheme = {
    isPublic: true,
    font,
    questionColor,
    answerColor,
    buttonColor,
    backgroundColor,
    name,
    backgroundImage,
  };

  Theme.create(newTheme)
    .then(theme => res.status(201).json(theme))
    .catch(err => res.status(400).json(err));
};

const getPublicThemes = (req, res) => {
  Theme.find({ isPublic: 'true' })
    .then(themes => res.status(200).json(themes))
    .catch(err => res.status(400).json(err));
};

const create = (req, res) => {
  const {
    font,
    questionColor,
    answerColor,
    buttonColor,
    backgroundColor,
    backgroundImage,
    name,
  } = req.body;
  const userId = req.user.id;
  User.findById(userId)
    .then(user => {
      const newTheme = {
        isPublic: false,
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
          await Authority.create({
            objectTitle: ObjectTitle.THEME,
            objectId: theme.id,
            userId,
            rights: [Rights.GET, Rights.UPDATE, Rights.REMOVE],
          });
          res.status(201).json(theme);
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
};

const getUserThemes = (req, res) => {
  const { id } = req.user;
  User.findById(id)
    .populate('themes')
    .exec()
    .then(user => res.status(200).json(user.themes))
    .catch(err => res.status(400).json(err));
};

const getById = (req, res) => {
  Theme.findById(req.params.id)
    .then(theme => res.status(200).json(theme))
    .catch(err => res.status(400).json(err));
};

const update = (req, res) => {
  const { _id } = req.body;
  const {
    font,
    questionColor,
    answerColor,
    buttonColor,
    backgroundColor,
    backgroundImage,
    name,
  } = req.body;
  const updatedTheme = {
    font,
    questionColor,
    answerColor,
    buttonColor,
    backgroundColor,
    name,
    backgroundImage,
  };
  Theme.findByIdAndUpdate(_id, updatedTheme)
    .then(() => res.status(200).json(success))
    .catch(err => res.status(400).json(err));
};

const remove = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  Theme.findByIdAndDelete(id)
    .then(async () => {
      try {
        await Authority.deleteOne({
          objectTitle: ObjectTitle.THEME,
          objectId: id,
        });

        await User.updateOne(
          { _id: userId },
          {
            $pull: { themes: id },
          }
        );

        const publicTheme = await Theme.findOne({ isPublic: true });
        await Template.updateMany({ theme: id }, { theme: publicTheme.id });

        return res.status(200).json(success);
      } catch (err) {
        return res.status(400).json(err);
      }
    })
    .catch(err => res.status(400).json(err));
};

module.exports = {
  createPublicTheme,
  getPublicThemes,
  create,
  getUserThemes,
  getById,
  update,
  remove,
};
