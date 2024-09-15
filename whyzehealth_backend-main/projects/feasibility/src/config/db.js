const AWS = require('aws-sdk');
const { Sequelize } = require('sequelize');
const pg = require('pg');
const fs = require('fs');
const path = require('path');

let sequelize;

const getPassword = async () => {
  const dbSecretArn = process.env.DB_SECRET_ARN || '';
  const secretManager = new AWS.SecretsManager({
    region: process.env.REGION || '',
  });
  const secretParams = {
    SecretId: dbSecretArn,
  };
  const dbSecret = await secretManager.getSecretValue(secretParams).promise();
  const secretString = dbSecret.SecretString || '';
  const { password } = JSON.parse(secretString);

  return password;
};

function connectDB() {
  return new Promise(async (resolve, reject) => {
    const password = process.env.DB_PASSWORD
      ? process.env.DB_PASSWORD
      : await getPassword();

    sequelize = new Sequelize(process.env.DB_NAME, 'postgres', password, {
      host: process.env.DB_ENDPOINT_ADDRESS,
      dialect: 'postgres',
      dialectModule: pg,
      logging: false,
      define: {
        timestamps: false,
      },
      pool: {
        max: 9,
        min: 0,
        idle: 120000,
      },
    });

    sequelize
      .authenticate()
      .then(() => {
        console.log('DB connected');
        sequelize.models = generateModels();
        console.log({ sequelizemodels: sequelize.models });
        resolve();
      })
      .catch((err) => {
        console.log('DB not connected');
        console.log(err);
        reject();
      });
  });
}

const models = {};

function generateModels() {
  const modelPath = path.join(__dirname, '..', 'model');
  console.log(`get models : model path = ${modelPath}`);

  const allModels = [
    require('../model/Medication'),
    require('../model/PatientCondition'),
    require('../model/Patients'),
    require('../model/Users'),
    require('../model/Projects'),
    require('../model/FeasibilityStudy'),
  ];

  allModels.forEach((m) => {
    var model = m(sequelize, Sequelize.DataTypes);
    console.log(`found model : ${model.name}`);
    models[model.name] = model;
  });

  models['Projects'].hasMany(models['FeasibilityStudy'], {
    targetKey: 'Id',
    foreignKey: 'ProjectId',
  });

  models['Users'].hasMany(models['Projects'], {
    foreignKey: 'UserId',
  });
  return models;
}

(async () => {
  if (process.env.RUNNING_ENV !== 'lambda') {
    connectDB();
  }
})();

const getModelByName = (name) => {
  return models[name];
};

const getModels = () => {
  return models;
};

const getSequlize = () => {
  return sequelize;
};

module.exports = {
  sequelize,
  connectDB,
  getModelByName,
  getModels,
  getSequlize,
};
