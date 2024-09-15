const mongoose = require('mongoose');

const { Schema } = mongoose;

const medicalConditionSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'user' },
    name: {
      type: String,
    },
    icd10_code: {
      type: String,
    },
    status: {
      type: String,
    },
    is_in_treatment: {
      type: Boolean,
    },
    is_recovered: {
      type: Boolean,
    },
    diagnosis_date: {
      type: Date,
    },
    recovery_date: {
      type: Date,
    },
    main_issue: { type: Schema.Types.ObjectId, ref: 'medical_condition' },
    related_issues: {
      type: [Schema.Types.ObjectId],
      ref: 'medical_condition',
    },
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
    collection: 'medical_condition',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'MedicalCondition',
  },
);

// eslint-disable-next-line func-names
medicalConditionSchema.virtual('medical_condition_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('MedicalCondition', medicalConditionSchema);
