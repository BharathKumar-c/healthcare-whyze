const { Router } = require('express');
const { preferenceController } = require('../../../controllers');

const router = Router();

router.get('/', preferenceController.getPreferenceDetails);

router.post('/', preferenceController.createOrUpdatePatientPreferenceMap);

router.put('/:id', preferenceController.updatePreference);

router.patch(
  '/therapeutic-areas/:id',
  preferenceController.updateUserTherapeuticAreas,
);

module.exports = router;
