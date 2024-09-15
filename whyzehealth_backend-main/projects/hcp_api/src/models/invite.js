const mongoose = require('mongoose');

const { Schema } = mongoose;

const inviteSchema = new Schema(
  {
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    email_verification_code: {
      type: String,
    },
    phone_verification_code: {
      type: String,
    },
    phone_no_of_attempts: {
      type: Number,
    },
    email_verified: {
      type: Boolean,
    },
    phone_verified: {
      type: Boolean,
    },
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
  },
  {
    collection: 'invite',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'Invite',
  },
);

// eslint-disable-next-line func-names
inviteSchema.virtual('invite_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('Invite', inviteSchema);
