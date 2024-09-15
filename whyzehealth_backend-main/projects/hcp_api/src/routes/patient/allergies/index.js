const { Router } = require('express');

const router = Router();
const { patientController } = require('../../../controllers');

router.get('/', patientController.getPatientAllergies);
router.post('/', patientController.addPatientAllergies);
router.patch('/:id', patientController.updatePatientAllergies);
router.delete('/:id', patientController.deletePatientAllergies);
router.get('/masterdata', patientController.getMasterAllergies);
module.exports = router;
