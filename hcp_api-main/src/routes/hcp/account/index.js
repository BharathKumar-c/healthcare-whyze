const { Router } = require('express');

const router = Router();
const { accountController } = require('../../../controllers');
const { validateHcp } = require('../../../middleware');

router.post('/login', accountController.hcpLogin);
router.get('/refresh_token', accountController.refreshToken);
router.post('/setup_account', accountController.setupAccount);
router.get('/user', validateHcp, accountController.getUser);
router.put('/user', validateHcp, accountController.updateUserProfile);

module.exports = router;
