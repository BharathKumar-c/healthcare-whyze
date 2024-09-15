const { AWS_CONFIG } = require('../config');

const { AWS_SNS } = AWS_CONFIG;

const sendSMS = async ({ message, phone }) => {
  const params = {
    Message: message,
    PhoneNumber: phone,
  };

  return AWS_SNS.publish(params).promise();
};

module.exports = { sendSMS };
