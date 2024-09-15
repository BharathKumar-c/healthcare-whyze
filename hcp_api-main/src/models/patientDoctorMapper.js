const mongoose = require('mongoose');

const { Schema } = mongoose;

const patientDoctorMapperSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId },
    hcp: { type: Schema.Types.ObjectId, ref: 'user' },
    is_connected: { type: Boolean },
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
    collection: 'patient_doctor_mapper',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'PatientDoctorMapper',
  },
);
// eslint-disable-next-line func-names
patientDoctorMapperSchema.virtual('patient_doctor_mapper_id').get(function () {
  return this._id;
});

module.exports = mongoose.model(
  'PatientDoctorMapper',
  patientDoctorMapperSchema,
);
