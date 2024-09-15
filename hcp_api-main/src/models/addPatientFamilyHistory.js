const mongoose = require('mongoose');

const { Schema } = mongoose;

const patientFamilyDetailsSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'user' },
    relation: {
      type: Schema.Types.ObjectId,
      ref: 'family_realtionship_master',
    },
    name: { type: String },
    patient_medical_condition: {
      type: Schema.Types.String,
    },
    icd10_code: {
      type: String,
    },
    further_comments: { type: String },
    is_active: {
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
    collection: 'patient_family_details',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'PatientFamilyDetails',
  },
);

patientFamilyDetailsSchema
  .virtual('patient_family_details_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model(
  'PatientFamilyDetails',
  patientFamilyDetailsSchema,
);
