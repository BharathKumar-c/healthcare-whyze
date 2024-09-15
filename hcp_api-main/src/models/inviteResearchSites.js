const mongoose = require('mongoose');

const { Schema } = mongoose;

const inviteResearchSitesSchema = new Schema(
  {
    trial_status: {
      type: String,
    },
    trial_participated_by: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    clinical_trial: {
      type: String,
    },
    sponsor: {
      type: String,
    },
    description: {
      type: String,
    },
    site: {
      type: Schema.Types.ObjectId,
    },
    feasibility_study: {
      type: Schema.Types.Array,
    },
    clinical_trial_appointments: {
      type: [Schema.Types.ObjectId],
      ref: 'ClinicalTrialAppointment',
    },
    research_project: {
      type: Schema.Types.ObjectId,
    },
    segment: {
      type: Schema.Types.ObjectId,
    },
    is_favourite: {
      type: Boolean,
    },
    total_patients: {
      type: Number,
    },
    patients: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
    },
    patients_recruited: {
      type: Number,
    },
    patients_prescreened: {
      type: Number,
    },
    patients_screened: {
      type: Number,
    },
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
  },
  {
    collection: 'invite_research_sites',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'InviteResearchSites',
  },
);

inviteResearchSitesSchema
  .virtual('invite_research_sites_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model(
  'InviteResearchSites',
  inviteResearchSitesSchema,
);
