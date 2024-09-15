const { Router } = require('express');
const { HIController } = require('../../../controllers');

const router = Router();

router.get('/', HIController.getHIMaster);
router.get('/:id/plans', HIController.getHIPlanMaster);

router.get('/patient_hi', HIController.getMyHI);
router.post('/', HIController.createPatientHI);
router.put('/:id', HIController.updatePatientHI);

module.exports = router;
