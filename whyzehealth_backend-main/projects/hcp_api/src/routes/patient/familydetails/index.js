const { Router } = require('express');

const router = Router();
const { patientController } = require('../../../controllers');

router.post('/', patientController.addFamilyHistory);
router.get('/', patientController.getFamilyHistory);
router.patch('/:id', patientController.updateFamilyHistory);
router.delete('/:id', patientController.deleteFamilyHistory);
router.get('/masterdata', patientController.getMasterRealtionship);
module.exports = router;
