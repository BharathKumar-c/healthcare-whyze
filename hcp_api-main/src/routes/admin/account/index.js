const { Router } = require('express');

const router = Router();
const { accountController } = require('../../../controllers');

router.post('/login', accountController.adminLogin);
router.get('/refresh_token', accountController.refreshToken);

module.exports = router;
