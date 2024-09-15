const { AWS_CONFIG } = require('../config');

const { AWS_SES } = AWS_CONFIG;

const sendEmail = ({ from = 'admin@whyzehealth.com', to, subject, body }) => {
  const params = {
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

const sendTemplatedEmail = ({
  from = 'admin@whyzehealth.com',
  to,
  Template = 'whyze-change-email-verification-template',
  data,
}) => {
  const params = {
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
    Template,
    TemplateData: JSON.stringify(data),
  };
  return AWS_SES.sendTemplatedEmail(params).promise();
};

module.exports = { sendEmail, sendTemplatedEmail };
