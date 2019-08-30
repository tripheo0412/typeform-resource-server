const mongoose = require('mongoose');
const isEmpty = require('../utils/isEmpty');

const { Schema } = mongoose;

const AuthoritySchema = new Schema({
  objectTitle: { type: String, required: true },
  objectId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  rights: {
    type: [String],
    validate: rights => !isEmpty(rights),
  },
});

const Authority = mongoose.model('Authority', AuthoritySchema);

module.exports = Authority;
