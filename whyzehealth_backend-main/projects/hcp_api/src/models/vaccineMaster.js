const mongoose = require('mongoose');

const { Schema } = mongoose;

const vaccineMasterSchema = new Schema(
  {
    name: {
      type: String,
    },
    condition: {
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
    collection: 'vaccine_master',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'vaccineMaster',
  },
);

// eslint-disable-next-line func-names
vaccineMasterSchema.virtual('vaccine_master_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('vaccineMaster', vaccineMasterSchema);
