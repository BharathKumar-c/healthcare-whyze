const mongoose = require('mongoose');

const { Schema } = mongoose;

const doctorNotificationSchema = new Schema(
  {
    invite_research_site: {
      type: Schema.Types.ObjectId,
      ref: 'InviteResearchSites',
    },
    is_readed: {
      type: Boolean,
      default: false,
    },
    clinical_trial_appointments: {
      type: Schema.Types.ObjectId,
      ref: 'ClinicalTrialAppointment',
    },
    status: { type: String },
    is_assigned: {
      type: Boolean,
      default: false,
    },
    patient_id: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
  },
  {
    collection: 'doctor_notification',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'DoctorNotification',
  },
);

doctorNotificationSchema
  .virtual('doctor_notification_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model('DoctorNotification', doctorNotificationSchema);
