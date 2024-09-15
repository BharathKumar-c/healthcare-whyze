const mongoose = require('mongoose');

const { Schema } = mongoose;

const therapeuticAreasSchema = new Schema(
  {
    name: {
      type: String,
    },
  },
  {
    collection: 'therapeutic_areas',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'TherapeuticAreas',
  },
);

// eslint-disable-next-line func-names
therapeuticAreasSchema
  .virtual('therapeutic_areas_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model('TherapeuticAreas', therapeuticAreasSchema);
