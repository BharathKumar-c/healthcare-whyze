const { Router } = require('express');

const router = Router();

const { patientController } = require('../../../controllers');

router.get('/masterdata', patientController.getMasterReaction);

module.exports = router;
