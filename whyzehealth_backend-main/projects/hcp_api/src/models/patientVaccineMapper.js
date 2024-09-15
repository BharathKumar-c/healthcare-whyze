const mongoose = require('mongoose');

const { Schema } = mongoose;

const patientVaccineMapperSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'patient',
    },
    vaccines: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'vaccine_master',
        },
        date: {
          type: String,
        },
      },
    ],
    condition: {
      type: String,
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
    collection: 'patient_vaccine_mapper',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'patientVaccineMapper',
  },
);

patientVaccineMapperSchema
  .virtual('patient_vaccine_mapper_id')
  // eslint-disable-next-line func-names
  .get(function () {
    return this._id;
  });

module.exports = mongoose.model(
  'patientVaccineMapper',
  patientVaccineMapperSchema,
);
