const mongoose = require('mongoose');

const { Schema } = mongoose;

const preferenceTenantMapperSchema = new Schema(
  {
    preference: { type: Schema.Types.ObjectId, ref: 'preference' },
    tenant: { type: Schema.Types.ObjectId, ref: 'tenant' },
    is_connected: { type: Boolean, default: false },
    travel_distance: { type: String },
  },
  {
    collection: 'preference_tenant_mapper',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'preferenceTenantMapper',
  },
);

preferenceTenantMapperSchema
  .virtual('preference_tenant_mapper_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model(
  'preferenceTenantMapper',
  preferenceTenantMapperSchema,
);
