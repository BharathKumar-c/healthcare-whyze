const mongoose = require('mongoose');

const { Schema } = mongoose;

const tenantGroupMapperSchema = new Schema(
  {
    hospital_group_name: {
      type: String,
    },
    image: {
      type: String,
    },
    hospitals: {
      type: [{ type: Schema.Types.ObjectId, ref: 'tenant' }],
    },
  },
  {
    collection: 'tenant_group_mapper',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'TenantGroupMapper',
  },
);

// eslint-disable-next-line func-names
tenantGroupMapperSchema.virtual('tenant_group_mapper_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('TenantGroupMapper', tenantGroupMapperSchema);
