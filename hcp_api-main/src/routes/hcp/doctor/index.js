const { Router } = require('express');

const router = Router();

const { doctorController } = require('../../../controllers');

router.get('/:id', doctorController.searchDoctorsByName);

module.exports = router;
