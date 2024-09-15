const { Router } = require('express');
const { validatePatient } = require('../../../middleware');
const { patientDoctorConnectionController } = require('../../../controllers');

const router = Router();

router.get(
  '/',
  validatePatient,
  patientDoctorConnectionController.getAllConnectedDoctors,
);

router.get(
  '/:id',
  validatePatient,
  patientDoctorConnectionController.getConnectedDoctorById,
);

router.post(
  '/',
  validatePatient,
  patientDoctorConnectionController.createOrUpdateDoctorConnection,
);

router.put('/hcp/:id', patientDoctorConnectionController.updatePatientDoctor);

router.post('/hcp', patientDoctorConnectionController.mapPatientDoctor);

module.exports = router;
