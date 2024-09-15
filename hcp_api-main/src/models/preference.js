const mongoose = require('mongoose');

const { Schema } = mongoose;

const preferenceSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'user' },
    surveys: { type: Schema.Types.Boolean, default: 'false' },
    clinical_trials: { type: Schema.Types.Boolean, default: 'false' },
    pseudonymised_data: { type: Schema.Types.Boolean, default: 'false' },
    preference_tenant_mapper: {
      type: Schema.Types.ObjectId,
      ref: 'preference_tenant_mapper',
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
    collection: 'preference',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'Preference',
  },
);

// eslint-disable-next-line func-names
preferenceSchema.virtual('preference_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('Preference', preferenceSchema);
