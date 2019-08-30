const mongoose = require('mongoose');

const { Schema } = mongoose;

const WorkspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    collaborators: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    templates: [{ type: Schema.Types.ObjectId, ref: 'Templates' }],
  },
  { timestamps: true }
);

const Workspace = mongoose.model('Workspaces', WorkspaceSchema);

module.exports = Workspace;
