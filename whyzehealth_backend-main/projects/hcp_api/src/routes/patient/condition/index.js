const { Router } = require('express');
const { conditionController } = require('../../../controllers');
const { validateBodyData } = require('../../../middleware');

const router = Router();

router.get('/', conditionController.getAllMyMedicalCondition);
router.get('/masterdata', conditionController.getMasterMedicalCondition);
router.get('/:id', conditionController.getMyMedicalConditionById);

router.post('/', validateBodyData, conditionController.createMedicalCondition);

router.put(
  '/:id',
  validateBodyData,
  conditionController.updateMedicalCondition,
);

module.exports = router;
