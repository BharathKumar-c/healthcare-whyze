const { Router } = require('express');
const { validateBodyData } = require('../../../middleware');

const router = Router();
const { lifestyleController } = require('../../../controllers');

router.post(
  '/',
  validateBodyData,
  lifestyleController.createLifeStyleAndHealth,
);

router.get('/dietary', lifestyleController.getAllDiet);

module.exports = router;
