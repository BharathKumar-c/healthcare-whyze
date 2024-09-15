const { Router } = require('express');
const { TestController } = require('../controller');

const router = Router();

router.get('/', TestController.test);

module.exports = router;
