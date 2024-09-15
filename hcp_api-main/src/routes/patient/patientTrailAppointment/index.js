const { Router } = require('express');
const { trailAppointmentController } = require('../../../controllers');

const router = Router();

router.get(
  '/trail-appointment-dates/:id',
  trailAppointmentController.getDescriptionandDate,
);
router.put(
  '/trail-appointment-dates/:id',
  trailAppointmentController.updateTrailAppointment,
);
module.exports = router;
