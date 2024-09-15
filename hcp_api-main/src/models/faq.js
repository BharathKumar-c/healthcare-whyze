const mongoose = require('mongoose');

const { Schema } = mongoose;

const faqSchema = new Schema(
  {
    question_title: {
      type: String,
    },
    answer_text: {
      type: String,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      default: 'admin',
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      default: 'admin',
    },
  },
  {
    collection: 'faq',
    minimize: false,
    timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' },
    modelName: 'Faq',
  },
);

// eslint-disable-next-line func-names
faqSchema.virtual('faq_id').get(function () {
  return this._id;
});

module.exports = mongoose.model('Faq', faqSchema);
