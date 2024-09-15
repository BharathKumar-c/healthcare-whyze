const mongoose = require('mongoose');

const { Schema } = mongoose;

const healthInsuranceMasterSchema = new Schema(
  {
    name: {
      type: String,
      ref: 'user',
    },
    country: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
    },
    is_system_added: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  {
    collection: 'health_insurance_master',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'HealthInsuranceMaster',
  },
);

healthInsuranceMasterSchema
  .virtual('health_insurance_master_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model(
  'HealthInsuranceMaster',
  healthInsuranceMasterSchema,
);
