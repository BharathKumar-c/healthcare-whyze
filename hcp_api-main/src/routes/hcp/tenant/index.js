const { Router } = require('express');
const { tenantController } = require('../../../controllers');

const router = Router();

router.get('/', tenantController.searchMasterTenantsByName);
router.post('/', tenantController.createMasterTenant);
module.exports = router;
