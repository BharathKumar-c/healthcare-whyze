const { Router } = require('express');

const router = Router();

const { appointmentController } = require('../../../controllers');

router.post('/create-appointment', appointmentController.createAppoinment);

module.exports = router;
