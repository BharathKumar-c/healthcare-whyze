const { Router } = require('express');

const router = Router();
const { accountController } = require('../../../controllers');

router.post(
  '/send-email-verification',
  accountController.sendEmailVerification,
);

router.get('/verify-email', accountController.verifyEmail);

router.post('/send-phone-Verification', accountController.verifyPhone);

router.post('/verify-phone', accountController.updatePhone);

module.exports = router;
