const mongoose = require('mongoose');

const { Schema } = mongoose;

const patientHealthInsuranceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    health_insurance: {
      type: Schema.Types.ObjectId,
      ref: 'health_insurance_master',
    },
    health_insurance_plan: {
      type: Schema.Types.ObjectId,
      ref: 'health_insurance_plan_master',
    },
    policy_number: {
      type: String,
    },
    pps_number: {
      type: String,
    },
    gms_number: {
      type: String,
    },
    has_medical_card: {
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
    collection: 'patient_health_insurance',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'patientHealthInsurance',
  },
);

patientHealthInsuranceSchema
  .virtual('patient_health_insurance_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model(
  'patientHealthInsurance',
  patientHealthInsuranceSchema,
);
