const mongoose = require('mongoose');

const { Schema } = mongoose;

const tenantSchema = new Schema(
  {
    name: {
      type: String,
    },
    unique_name: {
      type: String,
      index: true,
    },
    is_system_added: {
      type: Boolean,
      default: true,
    },
    access_type: {
      type: String,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
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
    country: {
      type: 'string',
    },
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
  },
  {
    collection: 'tenant',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'Tenant',
  },
);

// eslint-disable-next-line func-names
tenantSchema.virtual('tenant_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('Tenant', tenantSchema);
