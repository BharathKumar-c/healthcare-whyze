const AWS = require('aws-sdk');
// Create an Amazon DynamoDB service client object.
const ddbClient = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });
export { ddbClient };
