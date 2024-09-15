const { Router } = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');

const upload = multer();

const router = Router();
const { inviteController } = require('../../../controllers');

router.get(
  '/getAllTherapeuticAreas',
  inviteController.getAllTherapeuticAreasList,
);

router.post(
  '/createHospital',
  upload.single('logo'),
  inviteController.createHospital,
);

router.post(
  '/createHospitalGroup',
  upload.single('logo'),
  inviteController.createHospitalGroup,
);

module.exports = router;
