const mongoose = require('mongoose');
const roleConstant = require('../appConstants/roleConstant');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    password: {
      type: String,
    },
    forgot_password_token: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    country: {
      type: String,
    },
    picture_url: {
      type: String,
    },
    account_status: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    email_verification_token: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    tenant: {
      type: [{ type: Schema.Types.ObjectId, ref: 'tenant' }],
    },
    tenant_group: {
      type: [{ type: Schema.Types.ObjectId, ref: 'tenant_group_mapper' }],
    },
    role: {
      type: String,
      enum: roleConstant.userModelRoleCheck,
      validate: {
        validator(v) {
          return (
            /^[a-z_]+$/.test(v) && roleConstant.userModelRoleCheck.includes(v)
          );
        },
        message: props => `${props.value} is not a valid status value`,
      },
    },
    preference: {
      type: Schema.Types.ObjectId,
      ref: 'preference',
    },
    patient_detail: {
      type: Schema.Types.ObjectId,
      ref: 'patient',
    },
    address_line1: {
      type: String,
    },
    address_line2: {
      type: String,
    },
    address_line3: {
      type: String,
    },
    city: {
      type: String,
    },
    post_code: {
      type: String,
    },
    clinic_name: {
      type: String,
    },
    is_system_added: {
      type: Boolean,
      default: true,
    },
    account_created_by: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
    next_notification_time: {
      type: Date,
    },
    notification_sent_count: {
      type: Number,
    },
    therapeutic_areas: {
      type: [{ type: Schema.Types.ObjectId, ref: 'therapeutic_areas' }],
    },
    nhs_number: {
      type: String,
    },
    is_linked_permission_sent: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'user',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'User',
  },
);

// eslint-disable-next-line func-names
userSchema.virtual('user_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('User', userSchema);
