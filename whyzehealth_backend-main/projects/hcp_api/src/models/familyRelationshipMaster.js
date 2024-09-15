const mongoose = require('mongoose');

const { Schema } = mongoose;

const familyRealtionshipMasterSchema = new Schema(
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
    collection: 'family_realtionship_master',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'FamilyRealtionshipMaster',
  },
);

familyRealtionshipMasterSchema
  .virtual('family_realtionship_master_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model(
  'FamilyRealtionshipMaster',
  familyRealtionshipMasterSchema,
);
