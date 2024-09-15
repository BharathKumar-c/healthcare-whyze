const mongoose = require('mongoose');

const { Schema } = mongoose;

const patientAllergiesSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'user' },
    allergy: { type: Schema.Types.ObjectId, ref: 'allergies_master' },
    reactions: [{ type: Schema.Types.ObjectId, ref: 'reaction_master' }],
    comment: { type: String },
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
    collection: 'patient_allergies',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'PatientAllergies',
  },
);

// eslint-disable-next-line func-names
patientAllergiesSchema.virtual('patient_allergies_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('PatientAllergies', patientAllergiesSchema);
