const AWS = require('aws-sdk');

const AWS_CONFIG = {
  accessKeyId: process.env?.ACCESS_KEY,
  secretAccessKey: process.env?.SECRET_KEY,
  region: process.env?.REGION,
};

if (process.env.SERVER_ENV === 'dev') {
  AWS.config.update(AWS_CONFIG);
}
const AWS_SES = new AWS.SES();

const AWS_SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

// s3
const s3 = new AWS.S3({ apiVersion: '2010-03-31' });
const s3_bucket = process.env.S3_BUCKET;
const s3_medication = process.env.S3_MEDICATION;

module.exports = {
  AWS_SES,
  AWS_SNS,
  s3,
  s3_bucket,
  s3_medication,
};
