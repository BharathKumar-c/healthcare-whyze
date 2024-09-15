const { Router } = require('express');

const router = Router();
const { patientController } = require('../../../controllers');

router.get('/', patientController.getPatientDetails);
router.post('/', patientController.savePersonalDetails);
router.get(
  '/getProfileCompletionStep',
  patientController.getProfileCompletionStatus,
);
router.put(
  '/updateProfileCompletionStep',
  patientController.updateProfileCompletionStatus,
);

module.exports = router;
