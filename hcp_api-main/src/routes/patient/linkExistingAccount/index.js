const { Router } = require('express');

const router = Router();
const { accountController } = require('../../../controllers');

router.post('/patient', accountController.checkForExistingPatient);

router.post('/confirm-tenant', accountController.confirmTenant);

router.post(
  '/confirm-tenant-get-hcp',
  accountController.confirmTenantAndGetHcp,
);

router.post('/confirm-hcp-get-year', accountController.confirmHcpAndGetHcpYear);

router.post(
  '/confirm-year-get-health-condition',
  accountController.confirmHcpYearAndGetHealthCondition,
);

router.post('/confirm-condition', accountController.confirmHealthCondition);

router.post(
  '/update-existing-user',
  accountController.confirmUserAccountSwapProfile,
);

module.exports = router;
