const { Router } = require('express');
const { SearchController } = require('./../../controller');

const router = Router();

router.get('/indication', SearchController.getUniqueIndicationController);

router.get('/medication', SearchController.getUniqueMedicationController);

module.exports = router;
