const { Router } = require('express');

const router = Router();

const { patientController } = require('../../../controllers');

router.get('/', patientController.getMasterCase);

module.exports = router;
