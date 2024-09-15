const patientService = require('./patientService');
const jwtService = require('./jwtService');
const accountService = require('./accountService');
const smsService = require('./smsService');
const masterService = require('./masterService');
const tenantService = require('./tenantService');
const doctorService = require('./doctorService');
const fcmService = require('./fcmService');
const medicationService = require('./medicationService');
const conditionService = require('./conditionService');
const patientDoctorConnectionService = require('./patientDoctorConnectionService');
const vaccineService = require('./vaccineService');
const preferenceService = require('./preferenceService');
const appointmentService = require('./appointmentService');
const ICDService = require('./ICDService');
const emailService = require('./emailService');
const trailAppointmentService = require('./trailAppointmentService');

// Admin services
const inviteService = require('./inviteService');
const hospitalService = require('./hospitalService');
const dashboardService = require('./dashboardService');

// Research services
const siteService = require('./siteService');

module.exports = {
  patientService,
  jwtService,
  accountService,
  smsService,
  masterService,
  tenantService,
  doctorService,
  fcmService,
  medicationService,
  conditionService,
  patientDoctorConnectionService,
  vaccineService,
  preferenceService,
  appointmentService,
  ICDService,
  emailService,
  inviteService,
  hospitalService,
  siteService,
  dashboardService,
  trailAppointmentService,
};
