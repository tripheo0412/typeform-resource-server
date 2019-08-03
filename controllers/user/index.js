/* eslint-disable no-console */
const JWT = require('jsonwebtoken');
const User = require('../../models/user');
const Theme = require('../../models/theme');
const mailer = require('../../utils/mailer');
const handleResponse = require('../../utils/handleResponse');

const generateURL = require('../../utils/generateURL');
const { keys } = require('../../config');

const signVerifyToken = user =>
  JWT.sign({}, keys.VERIFY_SECRET, {
    subject: 'verify user account',
    audience: user.id,
    issuer: keys.ISSUER,
    expiresIn: '15m',
  });

const signUp = async (req, res) => {
  try {
    const { email, password, fname, lname, role, profilePicture } = req.body;
    let foundUser = await User.findOne({ 'local.email': email });
    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use' });
    }
    foundUser = await User.findOne({
      $or: [{ 'google.email': email }, { 'facebook.email': email }],
    });
    if (foundUser) {
      foundUser.methods.push('local');
      foundUser.local = {
        email,
        password,
      };
      await foundUser.save();
      return res.status(201).json({ success: true });
    }

    const newUser = new User({
      methods: ['local'],
      local: {
        email,
        password,
      },
      lname,
      fname,
      role,
      profilePicture,
      templateURL: generateURL(email),
    });
    await newUser.save();
    const mailOptions = {
      from: keys.MAILER_USER,
      to: newUser.local.email,
      subject: 'Typeform verify account by clicking this link',
      text: 'Verify Account by clicking this link',
      html: `<a href="https://typeform-auth-server.tripheo0412.now.sh/users/verify?token=${signVerifyToken(
        newUser
      )}"> Click here to verify </a>`,
    };

    await mailer.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return res.status(201).json({ success: true });
      }
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    const {
      _id,
      local: { email },
      fname,
      lname,
      profilePicture,
      workspaces,
      themes,
      templateURL,
    } = req.user;

    res.status(200).json({
      _id,
      local: { email },
      fname,
      lname,
      profilePicture,
      workspaces,
      themes,
      templateURL,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fname, lname, profilePicture } = req.body;
    const user = await User.findById(req.user._id);
    user.fname = fname;
    user.lname = lname;
    user.profilePicture = profilePicture;
    await user.save();
    res.status(200).json({
      id: user.id,
      email: user.local.email,
      fname: user.fname,
      lname: user.lname,
      profilePicture: user.profilePicture,
      workspaces: user.workspaces,
      themes: user.themes,
      templateURL: user.templateURL,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteUser = (req, res) => {
  User.findByIdAndDelete(req.user._id)
    .then(user => {
      if (handleResponse.notNullObject(user, 'user', res)) {
        Theme.remove({ themeId: user._id });
        return res.status(200).json(handleResponse.success);
      }
    })
    .catch(err => res.status(400).json(err));
};
module.exports = {
  signUp,
  getUser,
  updateProfile,
  deleteUser,
};
