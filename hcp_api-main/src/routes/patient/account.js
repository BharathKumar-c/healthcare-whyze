const { Router } = require('express');

const router = Router();
const multer = require('multer');
const { accountController } = require('../../controllers');

const upload = multer();
router.get('/', accountController.accountExists);
router.post('/phone/verify', accountController.verifyPhone);
router.post('/phone/confirm', accountController.confirmPhone);

router.post(
  '/register',
  upload.single('profileImage'),
  accountController.register,
);
router.post('/login', accountController.login);
router.get('/email_verify', accountController.verifyEmail);
router.get('/refresh_token', accountController.refreshToken);
router.get('/forgot_password', accountController.forgotPassword);
router.get('/set_password', accountController.setPassword);
router.post('/set_password', accountController.updatePassword);
router.get('/accept_request', accountController.acceptRequest);
router.get('/accept_sharing_request', accountController.acceptSharingAccess);

module.exports = router;
