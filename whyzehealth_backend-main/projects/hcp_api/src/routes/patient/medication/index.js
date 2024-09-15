const { Router } = require('express');
const { validateBodyData } = require('../../../middleware');

const router = Router();
const { medicationController } = require('../../../controllers');

router.get('/', validateBodyData, medicationController.getAllMyMedication);
router.get('/masterdata', medicationController.getMasterMedication);
router.get('/:id', validateBodyData, medicationController.getMyMedicationById);

router.post(
  '/',
  validateBodyData,
  medicationController.createPatientMedication,
);

router.put(
  '/:id',
  validateBodyData,
  medicationController.updatePatientMedication,
);

router.patch(
  '/:id',
  validateBodyData,
  medicationController.updatePatientMedication,
);

router.delete(
  '/:id',
  validateBodyData,
  medicationController.deletePatientMedication,
);

module.exports = router;
