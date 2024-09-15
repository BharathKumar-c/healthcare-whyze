const mongoose = require('mongoose');

const { Schema } = mongoose;

const healthInsurancePlanMasterSchema = new Schema(
  {
    name: {
      type: String,
    },
    health_insurance: {
      type: Schema.Types.ObjectId,
      ref: 'health_insurance_master',
    },
    is_deleted: {
      type: Boolean,
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
    collection: 'health_insurance_plan_master',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'HealthInsurancePlanMaster',
  },
);

healthInsurancePlanMasterSchema
  .virtual('health_insurance_plan_master_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model(
  'HealthInsurancePlanMaster',
  healthInsurancePlanMasterSchema,
);
