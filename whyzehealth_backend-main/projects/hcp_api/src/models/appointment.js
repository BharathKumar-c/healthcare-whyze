const mongoose = require('mongoose');

const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'user' },
    comments: { type: Schema.Types.String },
    hcp: { type: Schema.Types.ObjectId, ref: 'user' },
    type: { type: Schema.Types.String },
    condition: { type: Schema.Types.String },
    patient_name: { type: Schema.Types.String },
    hcp_name: { type: Schema.Types.String },
    case_id: { type: Schema.Types.String },
    comment: { type: Schema.Types.String },
    start_date: { type: Schema.Types.String },
    end_date: { type: Schema.Types.String },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    vital_status: { type: Schema.Types.String },
    location: { type: Schema.Types.String },
  },
  {
    collection: 'appointments',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'Appointments',
  },
);

// eslint-disable-next-line func-names
appointmentSchema.virtual('appointments_id').get(function () {
  return this._id;
});
module.exports = mongoose.model('Appointments', appointmentSchema);
