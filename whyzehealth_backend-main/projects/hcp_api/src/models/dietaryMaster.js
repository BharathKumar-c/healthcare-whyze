const mongoose = require('mongoose');

const { Schema } = mongoose;

const dietaryMasterSchema = new Schema(
  {
    name: {
      type: String,
    },
    created_by: {
      type: String,
      default: 'admin',
    },
    updated_by: {
      type: String,
      default: 'admin',
    },
  },
  {
    collection: 'dietary_master',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'DietaryMaster',
  },
);

// eslint-disable-next-line func-names
dietaryMasterSchema.virtual('dietary_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('DietaryMaster', dietaryMasterSchema);
