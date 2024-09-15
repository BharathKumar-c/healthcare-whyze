const { Router } = require('express');
const { SaveController } = require('./../../controller');

const router = Router();

router.post('/saveFeasibility', SaveController.saveFeasibilityStudyProject);
router.post('/', SaveController.getFeasibilityStudyProject);
router.get('/:id', SaveController.getFeasibilityStudyProjectById);

module.exports = router;
