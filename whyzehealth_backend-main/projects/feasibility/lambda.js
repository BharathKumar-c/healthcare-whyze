import app from './src/app';
 const {connectDB} = require('./src/config/db');

const serverlessExpress = require('@vendia/serverless-express');

let serverlessExpressInstance;

function asyncTask() {
  return connectDB();
}

async function setup(event, context) {
  const asyncValue = await asyncTask();
  console.log({ asyncValue });
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function handler(event, context) {
  if (serverlessExpressInstance)
    return serverlessExpressInstance(event, context);

  return setup(event, context);
}

exports.handler = handler;

//exports.handler = serverlessExpress({ app });
