const mongoose = require('mongoose');

const { Schema } = mongoose;

const dietaryMasterSchema = new Schema(
  {
    token: {
      type: String,
      unique: true,
    },
    user_id: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  {
    collection: 'fcm_token',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'FcmToken',
  },
);

// eslint-disable-next-line func-names
dietaryMasterSchema.virtual('fcm_token_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('FcmToken', dietaryMasterSchema);
