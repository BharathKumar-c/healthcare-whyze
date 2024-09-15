const mongoose = require('mongoose');

const { Schema } = mongoose;

const accessSettingsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    to_share_user: { type: Schema.Types.ObjectId, ref: 'user', default: null },
    correspondence: {
      type: Boolean,
      default: true,
    },
    procedures: {
      type: Boolean,
      default: true,
    },
    appointments: {
      type: Boolean,
      default: true,
    },
    medication: {
      type: Boolean,
      default: true,
    },
    conditions: {
      type: Boolean,
      default: true,
    },
    vaccines: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: String,
      default: 'admin',
    },
    updated_by: {
      type: String,
      default: 'admin',
    },
  },
  {
    collection: 'access_settings',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'AccessSettings',
  },
);

// eslint-disable-next-line func-names
accessSettingsSchema.virtual('access settings_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('AccessSettings', accessSettingsSchema);
