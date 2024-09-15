const express = require('express');

const { Router } = express;
const { tenantController } = require('../../../controllers');
const doctorRouter = require('./doctor');

const router = Router();

router.get('/', tenantController.searchMasterTenantsByName);
router.patch('/:id', tenantController.updateUserTenant);
router.use('/:id', doctorRouter);

module.exports = router;
