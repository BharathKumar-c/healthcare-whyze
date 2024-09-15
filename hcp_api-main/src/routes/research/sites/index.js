const { Router } = require('express');

const router = Router();

const { sitesController } = require('../../../controllers');
const { validateResearchUser } = require('../../../middleware');

router.post(
  '/trial-invite',
  validateResearchUser,
  sitesController.inviteSitesToTrial,
);

module.exports = router;
