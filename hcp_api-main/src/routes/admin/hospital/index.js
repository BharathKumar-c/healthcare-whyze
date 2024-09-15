const { Router } = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');

const upload = multer();

const router = Router();
const { hospitalController } = require('../../../controllers');

router.get('/getAllHospitalList', hospitalController.getAllHospitalList);

router.get(
  '/getSingleHospitalProfile/:id',
  hospitalController.getSingleHospitalProfile,
);

router.put(
  '/updateHospitalProfile/:id',
  upload.single('logo'),
  hospitalController.updateHospitalProfileByHospitalId,
);

router.get(
  '/getAllHospitalUsers/:id',
  hospitalController.getAllHospitalUsersByHospitalId,
);

router.post(
  '/addUsersToHospital',
  hospitalController.addUsersToHospitalByHospitalId,
);

router.delete(
  '/deleteHospitalAdminUser/:id',
  hospitalController.deleteAdminUserByUserId,
);

router.patch('/updateUserRole', hospitalController.updateUserRoleById);

router.get('/searchHospitalByQuery', hospitalController.searchHospitalByQuery);

router.get(
  '/group/getHospitalGroupAdminUsers/:id',
  hospitalController.getHospitalGroupUsersByHospitalId,
);

router.post(
  '/group/addHospitalGroupAdminUsers',
  hospitalController.addHospitalGroupUsersByHospitalId,
);

router.get(
  '/group/getHospitalGroupProfile/:id',
  hospitalController.getHospitalGroupProfile,
);

router.put(
  '/group/updateHospitalGroupProfile/:id',
  upload.single('logo'),
  hospitalController.updateHospitalGroupProfileByHospitalId,
);

router.get(
  '/getClinicalResearchByHospitalId/:id',
  hospitalController.getClinicalResearchByHospitalId,
);

router.get(
  '/getPatientInsightsByHospitalId/:id',
  hospitalController.getPatientInsightsByHospitalId,
);

module.exports = router;
