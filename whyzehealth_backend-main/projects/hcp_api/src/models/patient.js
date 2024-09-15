const mongoose = require('mongoose');

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'user' },
    height: { type: String },
    height_unit: { type: String },
    weight: { type: String },
    weight_unit: { type: String },
    bmi: { type: String },
    blood_type: { type: String },
    is_smoker: { type: Boolean },
    smoke_frequency: { type: String },
    smoke_start_year: { type: String },
    smoke_quite_year: { type: String },
    alcohol_weekly_frequency: { type: String },
    relation: [{ type: Schema.Types.ObjectId, ref: 'patinet_family_details' }],
    dietary: [{ type: Schema.Types.ObjectId, ref: 'dietary_master' }],
    // preference: { type: Schema.Types.ObjectId, ref: 'preference' },
    // appointments: [{ type: Schema.Types.ObjectId, ref: 'appointments' }],
    ethnicity: { type: String },
    hcp_list: [{ type: Schema.Types.ObjectId, ref: 'patient_doctor_mapper' }],
    vaccine_list: [
      { type: Schema.Types.ObjectId, ref: 'patient_vaccine_mapper' },
    ],
    progress: [{ type: Schema.Types.Number }],
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
    collection: 'patient',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'Patient',
  },
);

// eslint-disable-next-line func-names
patientSchema.virtual('patient_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('Patient', patientSchema);
