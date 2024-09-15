const { Router } = require('express');

const { doctorController } = require('../../../../controllers');

const router = Router({ mergeParams: true });

router.get('/doctor', doctorController.searchDoctorsByName);

module.exports = router;
