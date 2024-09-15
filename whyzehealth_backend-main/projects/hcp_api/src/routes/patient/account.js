const { Router } = require('express');

const router = Router();
const { accountController } = require('../../controllers');

router.get('/', accountController.accountExists);
router.post('/phone/verify', accountController.verifyPhone);
router.post('/phone/confirm', accountController.confirmPhone);

router.post('/register', accountController.register);
router.post('/login', accountController.login);

router.get('/email_verify', accountController.verifyEmail);

router.get('/refresh_token', accountController.refreshToken);

router.get('/forgot_password', accountController.forgotPassword);

module.exports = router;
