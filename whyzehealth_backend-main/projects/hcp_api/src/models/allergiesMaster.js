const mongoose = require('mongoose');

const { Schema } = mongoose;

const allergiesMasterSchema = new Schema(
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
    collection: 'allergies_master',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'AllergiesMaster',
  },
);

// eslint-disable-next-line func-names
allergiesMasterSchema.virtual('allergies_master_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('AllergiesMaster', allergiesMasterSchema);
