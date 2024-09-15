const { Router } = require('express');
const { sitesController, patientController } = require('../../../controllers');

const router = Router();

router.get('/getTrials', sitesController.getTrials);
router.get('/getTrial/:id', sitesController.getTrialById);
router.patch('/participate-trial/:id', sitesController.participateTrial);
router.get('/getPatientList/:id', sitesController.getPatientListById);
router.patch('/favourite/:id', sitesController.updateTrialFavourite);
router.delete('/delete/:id', sitesController.deleteTrialById);
router.get('/patient-details/:id', patientController.getPatientDetails);
router.post(
  '/book-trial-appointment',
  sitesController.createClinicalTrialAppointment,
);
router.patch(
  '/book-trial-appointment/:id',
  sitesController.updateClinicalTrialAppointmentsStatus,
);
router.get(
  '/appointment-notification/:id',
  sitesController.getAppointmentNotification,
);
router.get('/notification-count/:id', sitesController.getNotificationCount);
router.patch(
  '/notification-count/:id',
  sitesController.updateNotificationCount,
);

module.exports = router;
