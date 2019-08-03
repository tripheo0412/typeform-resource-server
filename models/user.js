const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema(
  {
    methods: {
      type: [String],
      required: true,
    },
    local: {
      email: {
        type: String,
        lowercase: true,
      },
      password: {
        type: String,
      },
    },
    google: {
      id: {
        type: String,
      },
      email: {
        type: String,
        lowercase: true,
      },
    },
    facebook: {
      id: {
        type: String,
      },
      email: {
        type: String,
        lowercase: true,
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    profilePicture: {
      type: String,
    },
    templateURL: {
      type: String,
    },
    uuid: {
      type: String,
    },
    workspaces: [{ type: Schema.Types.ObjectId, ref: 'Workspaces' }],
    themes: [{ type: Schema.Types.ObjectId, ref: 'Themes' }],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function(next) {
  try {
    if (!this.methods.includes('local')) {
      next();
    }
    const user = this;
    if (!user.isModified('local.password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    this.local.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('Users', UserSchema);

module.exports = User;
