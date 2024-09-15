const { Router } = require('express');
const { fcmController } = require('../../../controllers');

const router = Router();

router.post('/token', fcmController.addToken);
router.post('/sendPushNotification', fcmController.sendPushNotification);

module.exports = router;
