const mongoose = require('mongoose');

const { Schema } = mongoose;

const patientMedicationSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: Number,
      integer: true,
      required: true,
    },
    dosage_unit: {
      type: String,
      required: true,
      enum: ['tablet', 'mg', 'ml', 'drops', 'capsule'],
      validate: {
        validator(v) {
          return (
            /^[a-z]+$/.test(v) &&
            ['tablet', 'mg', 'ml', 'drops', 'capsule'].includes(v)
          );
        },
        message: props => `${props.value} is not a valid status value`,
      },
    },
    frequency: {
      type: Number,
      integer: true,
      required: true,
    },
    frequency_unit: {
      type: String,
    },
    reason_for_taking: {
      type: String,
    },
    conditions: {
      type: Array,
    },
    image_file: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
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
    collection: 'patient_medication',
    minimize: false,
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'updated_on',
    },
    modelName: 'PatientMedication',
  },
);

// eslint-disable-next-line func-names
patientMedicationSchema.virtual('patient_medication_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('PatientMedication', patientMedicationSchema);
