const mongoose = require('mongoose');

const { Schema } = mongoose;

const CaseShema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'user' },
    status: { type: Schema.Types.String },
    type: { type: Schema.Types.String },
    comment: { type: Schema.Types.String },
    is_deleted: {
      type: Schema.Types.Boolean,
      default: 'false',
    },
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
  },
  {
    collection: 'case',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'Case',
  },
);
// eslint-disable-next-line func-names
CaseShema.virtual('case_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('Case', CaseShema);
