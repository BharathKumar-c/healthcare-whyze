const mongoose = require('mongoose');
const {
  accountCreated,
  accountJoined,
  accountShared,
} = require('../appConstants/displayConstant');

const { Schema } = mongoose;

const linkedAccountsSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'user' },
    linked_accounts: [
      {
        linked_user_account: { type: Schema.Types.ObjectId, ref: 'user' },
        relation: {
          type: Schema.Types.ObjectId,
          ref: 'family_realtionship_master',
        },
        is_accepted: {
          type: Boolean,
          default: false,
        },
        accepted_date: {
          type: Date,
          default: null,
        },
        acconut_type: {
          type: String,
          enum: [accountCreated, accountJoined, accountShared],
          validate: {
            validator(v) {
              return [accountCreated, accountJoined, accountShared].includes(v);
            },
            message: props =>
              `${props.value} is not a valid account type value`,
          },
        },
        is_admin_accept_request: {
          type: Boolean,
          default: false,
        },
        admin_accepted_date: {
          type: Date,
          default: null,
        },
      },
    ],
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
    collection: 'linked_accounts',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'LinkedAccounts',
  },
);

// eslint-disable-next-line func-names
linkedAccountsSchema.virtual('linked_accounts_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('LinkedAccounts', linkedAccountsSchema);
