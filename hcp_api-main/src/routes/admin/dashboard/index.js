const { Router } = require('express');

const router = Router();
const { dashboardController } = require('../../../controllers');

router.get('/org-count', dashboardController.getOrganizationsCount);

module.exports = router;
