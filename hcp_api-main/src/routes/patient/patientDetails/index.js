const { Router } = require('express');
const multer = require('multer');

const upload = multer();

const router = Router();
const { patientController } = require('../../../controllers');
const { validatePatient } = require('../../../middleware');

router.get('/', validatePatient, patientController.getPatientDetails);
router.post(
  '/',
  validatePatient,
  upload.single('profileImage'),
  patientController.savePersonalDetails,
);
router.get(
  '/getProfileCompletionStep',
  validatePatient,
  patientController.getProfileCompletionStatus,
);
router.put(
  '/updateProfileCompletionStep',
  validatePatient,
  patientController.updateProfileCompletionStatus,
);
router.get('/countries', patientController.getAllCountries);
module.exports = router;
