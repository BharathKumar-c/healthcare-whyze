const mongoose = require('mongoose');

const { Schema } = mongoose;

const countryListMasterSchema = new Schema(
  {
    name: { type: String },
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
    collection: 'country_list_master',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'CountryListMaster',
  },
);

// eslint-disable-next-line func-names
countryListMasterSchema.virtual('country_list_master_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('CountryListMaster', countryListMasterSchema);
