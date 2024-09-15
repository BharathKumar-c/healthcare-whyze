const patientSwagger = require('../controllers/patient/patientSwagger');
const lifestyleSwagger = require('../controllers/lifestyle/lifestyleSwagger');
const medicationSwagger = require('../controllers/medication/medicationSwagger');
const conditionSwagger = require('../controllers/condition/conditionSwagger');
const patientDoctorConnectionSwagger = require('../controllers/patientDoctorConnection/patientDoctorConnectionSwagger');
const accountSwagger = require('../controllers/account/accountSwagger');
const vaccineSwagger = require('../controllers/vaccine/vaccineSwagger');
const preferenceSwagger = require('../controllers/preference/preferenceSwagger');
const appointmentSwagger = require('../controllers/appointment/appointmentSwagger');
const HISwagger = require('../controllers/hi/HISwagger');
const fcmSwagger = require('../controllers/fcm/fcmSwagger');
const trailAppointment = require('../controllers/trailAppointment/trailAppointmentSwagger');

module.exports = {
  openapi: '3.0.0',
  // swagger: '2.0',
  info: {
    description: 'Whyze Health api swagger',
    version: '1.0.0',
    title: 'Whyze Health',
    contact: {
      email: 'admin@itero.io',
    },
  },
  servers: [
    {
      url:
        process.env.SERVER_ENV === 'dev_local'
          ? `http://localhost:${process.env.PORT}`
          : 'http://dev-w-devhc-ygpa5xcns75l-1309274599.eu-west-1.elb.amazonaws.com',
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  schemes: ['http', 'https'],
  tags: [
    {
      name: 'Patient App',
      description: 'Access to Patient',
    },
  ],
  paths: {
    ...patientSwagger.paths,
    ...lifestyleSwagger.paths,
    ...medicationSwagger.paths,
    ...conditionSwagger.paths,
    ...patientDoctorConnectionSwagger.paths,
    ...accountSwagger.paths,
    ...vaccineSwagger.paths,
    ...preferenceSwagger.paths,
    ...appointmentSwagger.paths,
    ...HISwagger.paths,
    ...fcmSwagger.paths,
    ...trailAppointment.paths,
  },
  securityDefinitions: {
    petstore_auth: {
      type: 'oauth2',
      authorizationUrl: 'http://whyze.swagger.io/oauth/dialog',
      flow: 'implicit',
      scopes: {
        'write:patient': 'modify patient in your account',
        'read:patient': 'read your patient',
      },
    },
    api_key: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header',
    },
  },
  definitions: {
    ...patientSwagger.definitions,
    ...lifestyleSwagger.definitions,
    ...medicationSwagger.definitions,
    ...conditionSwagger.definitions,
    ...patientDoctorConnectionSwagger.definitions,
    ...vaccineSwagger.definitions,
    ...preferenceSwagger.definitions,
    ...accountSwagger.definitions,
    ...HISwagger.definitions,
    ...fcmSwagger.definitions,
    ...trailAppointment.definitions,
  },
};
