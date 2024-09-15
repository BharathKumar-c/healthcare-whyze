const { Router } = require('express');
const { CaseController } = require('./../../controller');

const router = Router();

router.post('/', CaseController.getCaseCountDetails);
router.get('/getCount', CaseController.getPatientCount);

module.exports = router;
