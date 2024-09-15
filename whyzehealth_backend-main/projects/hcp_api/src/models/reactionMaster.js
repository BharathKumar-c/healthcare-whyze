const mongoose = require('mongoose');

const { Schema } = mongoose;

const reactionMasterSchema = new Schema(
  {
    status: { type: String },
    name: { type: String },
    comment: { type: String },
    created_by: {
      type: Schema.Types.ObjectId,
      default: 'admin',
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      default: 'admin',
    },
  },
  {
    collection: 'reaction_master',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'ReactionMaster',
  },
);

// eslint-disable-next-line func-names
reactionMasterSchema.virtual('reaction_master_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('ReactionMaster', reactionMasterSchema);
