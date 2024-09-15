const { s3, s3_bucket } = require('../config/AWS');

const getBufferAndFormatFromBase64File = base64File => {
  const format = base64File.substring(
    base64File.indexOf('data:') + 5,
    base64File.indexOf(';base64'),
  );
  // We need to get the actual file data from the string without the base64 prefix
  const base64String = base64File.replace(/^data:image\/\w+;base64,/, '');
  const buff = Buffer.from(base64String, 'base64');
  return {
    format,
    buff,
  };
};

const saveInS3Bucket = (format, buff, keyName) =>
  new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: `${s3_bucket}`,
        Key: `${keyName}`,
        Body: buff,
        ContentEncoding: 'base64',
        ContentType: format,
      },
      (err, data) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(data.Key);
        }
      },
    );
  });

const getSignedUrl = path => {
  const params = {
    Bucket: s3_bucket,
    Key: path,
    Expires: 1800, // 30 mins expiry
  };
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err.message);
      }
      return resolve(url);
    });
  });
};

const deleteObjInS3 = Key =>
  new Promise((resolve, reject) => {
    const params = {
      Bucket: s3_bucket,
      Key,
    };
    s3.deleteObject(params, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

module.exports = {
  getBufferAndFormatFromBase64File,
  saveInS3Bucket,
  getSignedUrl,
  deleteObjInS3,
};
