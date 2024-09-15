const { Router } = require('express');
const { vaccineController } = require('../../../controllers');

const router = Router();

router.get('/master', vaccineController.getAllVaccines);

// In the future, this can be used to get vaccinations by condition ID
// router.get('/master/:id', vaccineController.getVaccinesByCondition);

router.post('/master', vaccineController.createVaccine);

router.get('/', vaccineController.getMyVaccines);

// In the future, this can be used to get vaccinations by condition ID
// router.get('/:id', vaccineController.getMyVaccinesByCondition);

router.post('/', vaccineController.createPatientVaccineMap);

router.put('/:id', vaccineController.updatePatientVaccineMap);

module.exports = router;
