const AWS = require('aws-sdk');

const AWS_SES = new AWS.SES();

// to-do: create mail templates with AWS SES
const sendEmail = ({ from = 'admin@whyzehealth.com', to, subject, body }) => {
  let params = {
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  };
  return AWS_SES.sendEmail(params).promise();
};

export default { sendEmail };
