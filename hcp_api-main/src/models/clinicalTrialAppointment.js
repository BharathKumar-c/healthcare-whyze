const mongoose = require('mongoose');
const statusConstants = require('../appConstants/statusConstants');

const { Schema } = mongoose;

const clinicalTrialAppointmentSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    invite_research_site: {
      type: Schema.Types.ObjectId,
      ref: 'invite_research_sites',
    },
    upcoming_visit: {
      type: Number,
    },
    eligibility: {
      type: String,
    },
    in_eligible_reason: { type: String },
    status: {
      type: String,
      enum: statusConstants.clinicalTrialAppointmentStatus,
      default: statusConstants.notYetContacted,
      validate: {
        validator(v) {
          return (
            /^[a-zA-Z\s]+$/.test(v) &&
            statusConstants.clinicalTrialAppointmentStatus.includes(v)
          );
        },
        message: props => `${props.value} is not a valid status value`,
      },
    },
    study_status_date: [{ type: Number }],
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
  },
  {
    collection: 'clinical_trial_appointment',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'ClinicalTrialAppointment',
  },
);

clinicalTrialAppointmentSchema
  .virtual('clinical_trial_appointment_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model(
  'ClinicalTrialAppointment',
  clinicalTrialAppointmentSchema,
);
