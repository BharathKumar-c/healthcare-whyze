const { Router } = require('express');
const multer = require('multer');

const upload = multer();
const router = Router();
const { patientController } = require('../../../controllers');

router.post('/', patientController.addFamilyHistory);
router.get('/', patientController.getFamilyHistory);
router.patch('/:id', patientController.updateFamilyHistory);
router.delete('/:id', patientController.deleteFamilyHistory);
router.get('/masterdata', patientController.getMasterRealtionship);
router.post(
  '/family_accounts',
  upload.single('profileImage'),
  patientController.addFamilyAccount,
);
router.get('/family_accounts', patientController.getFamilyMemberAccounts);
router.put(
  '/family_accounts/:id',
  upload.single('profileImage'),
  patientController.updateFamilyMemberAccount,
);
router.delete(
  '/family_accounts/:id',
  patientController.deleteFamilyMemberAccount,
);
router.post('/switch-account', patientController.switchLinkedAccount);
router.get('/access_settings/:id', patientController.getAccessSettingsById);
router.put('/access_settings/:id', patientController.updateAccessSettingsById);
router.get(
  '/family_account_history',
  patientController.getFamilyAccountHistory,
);
router.post('/sharing_access', patientController.createShareAccessAccount);
router.put('/sharing_access/:id', patientController.removeSharingAccess);
module.exports = router;
