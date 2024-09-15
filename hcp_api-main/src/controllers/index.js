const patientController = require('./patient/patientController');
const accountController = require('./account/accountController');
const lifestyleController = require('./lifestyle/lifestyleController');
const tenantController = require('./tenant/tenantController');
const doctorController = require('./doctor/doctorController');
const fcmController = require('./fcm/fcmController');
const medicationController = require('./medication/medicationController');
const HIController = require('./hi/HIController');
const conditionController = require('./condition/conditionController');
const patientDoctorConnectionController = require('./patientDoctorConnection/patientDoctorConnectionController');
const vaccineController = require('./vaccine/vaccineController');
const masterDataController = require('./masterData/masterDataController');
const preferenceController = require('./preference/preferenceController');
const appointmentController = require('./appointment');
const trailAppointmentController = require('./trailAppointment/trailAppointmentController');
// Admin controller
const inviteController = require('./invite/inviteController');
const hospitalController = require('./hospital/hospitalController');
const dashboardController = require('./dashboard/dashboardController');

// Research controller
const sitesController = require('./sites');

module.exports = {
  patientController,
  accountController,
  lifestyleController,
  masterDataController,
  tenantController,
  doctorController,
  fcmController,
  medicationController,
  HIController,
  conditionController,
  patientDoctorConnectionController,
  vaccineController,
  preferenceController,
  appointmentController,
  inviteController,
  hospitalController,
  sitesController,
  dashboardController,
  trailAppointmentController,
};
