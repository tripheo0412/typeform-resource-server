/* eslint-disable no-console */
const JWT = require('jsonwebtoken');
const User = require('../../models/user');
const Authority = require('../../models/authority');
const Theme = require('../../models/theme');
const Workspace = require('../../models/workspace');
const Template = require('../../models/template');
const Form = require('../../models/form');
const { mail, transporter } = require('../../utils/mailer');
const { success } = require('../../utils/handleResponse');

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
      templateURL: keys.CLIENT_SITE_URL,
    });
    await newUser.save();
    const token = signVerifyToken(newUser);
    const mailOptions = mail;
    mailOptions.subject = `Hi ${fname} ${lname}! Welcome to Typeform, please verify your account`;
    mailOptions.context.action_url = `/users/verify?token=${token}`;
    mailOptions.to = [newUser.local.email];
    console.log('send mail on controller');
    transporter.sendMail(mailOptions, (error, info) => {
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
      id,
      local: { email },
      fname,
      lname,
      profilePicture,
      workspaces,
      themes,
      templateURL,
    } = req.user;

    res.status(200).json({
      id,
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
    const user = await User.findById(req.user.id);
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
  const userId = req.user.id;

  User.findByIdAndDelete(userId)
    .then(async user => {
      try {
        await Authority.deleteMany({ userId: req.user.id });

        await Workspace.updateMany(
          {
            collaborators: userId,
          },
          { $pull: { collaborators: userId } }
        );

        const workspaces = await Workspace.find({
          _id: { $in: user.workspaces },
        });

        workspaces.forEach(async workspace => {
          const templates = await Template.find({
            _id: { $in: workspace.templates },
          });
          templates.forEach(async template => {
            await Form.deleteMany({ _id: { $in: template.forms } });
            await template.remove();
          });
          await workspace.remove();
        });

        await Theme.deleteMany({ _id: { $in: user.themes } });

        return res.status(200).json(success);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
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
