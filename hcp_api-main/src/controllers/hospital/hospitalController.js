const { success } = require('../../appConstants/displayConstant');
const { hospitalService } = require('../../services');

const getAllHospitalList = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;

    const [hospitalList, totalCount] = await hospitalService.getAllHospital(
      page,
      perPage,
    );

    return res.status(200).json({ rows: hospitalList, count: totalCount });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getSingleHospitalProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hospitalService.getSingleHospitalProfileById(id);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const updateHospitalProfileByHospitalId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hospitalService.updateHospitalProfileById({
      id,
      hospitalProfileObj: req.body,
      logo: req.file,
    });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getAllHospitalUsersByHospitalId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hospitalService.getUsersByHospitalId(id);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const addUsersToHospitalByHospitalId = async (req, res) => {
  try {
    const { hospitalId, userObj } = req.body;
    await hospitalService.addUsersByHospitalId(hospitalId, userObj);
    return res.status(201).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const updateUserRoleById = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    await hospitalService.updateUserRole(userId, newRole);
    return res.status(200).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const deleteAdminUserByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    await hospitalService.deleteAdminUser(id);
    return res.status(200).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const searchHospitalByQuery = async (req, res) => {
  try {
    const { value } = req.query;

    if (!value || typeof value !== 'string') {
      return res.status(400);
    }

    const result = await hospitalService.searchHospital(value);

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Error in search hospital by query:', error);
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getHospitalGroupUsersByHospitalId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hospitalService.getGroupUsersByHospitalId(id);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const addHospitalGroupUsersByHospitalId = async (req, res) => {
  try {
    const { hospitalGroupId, userObj } = req.body;
    await hospitalService.addGroupUsersByHospitalGroupId(
      hospitalGroupId,
      userObj,
    );
    return res.status(201).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const deleteHospitalGroupAdminUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    await hospitalService.deleteAdminUser(id);
    return res.status(200).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getHospitalGroupProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hospitalService.getHospitalGroupProfileById(id);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const updateHospitalGroupProfileByHospitalId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hospitalService.updateHospitalGroupProfileById({
      id,
      hospitalGroupProfileObj: req.body,
      logo: req.file,
    });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getClinicalResearchByHospitalId = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;

    if (!id) {
      return res.status(400);
    }

    const [clinicalResearchList, totalCount] =
      await hospitalService.getClinicalResearchListByHospitalId(
        id,
        page,
        perPage,
      );

    return res
      .status(200)
      .json({ rows: clinicalResearchList, count: totalCount });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getPatientInsightsByHospitalId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await hospitalService.getPatientInsightsByCategory(id);
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  getAllHospitalList,
  getSingleHospitalProfile,
  updateHospitalProfileByHospitalId,
  getAllHospitalUsersByHospitalId,
  addUsersToHospitalByHospitalId,
  updateUserRoleById,
  deleteAdminUserByUserId,
  searchHospitalByQuery,
  getHospitalGroupUsersByHospitalId,
  addHospitalGroupUsersByHospitalId,
  deleteHospitalGroupAdminUsersById,
  getHospitalGroupProfile,
  updateHospitalGroupProfileByHospitalId,
  getClinicalResearchByHospitalId,
  getPatientInsightsByHospitalId,
};
