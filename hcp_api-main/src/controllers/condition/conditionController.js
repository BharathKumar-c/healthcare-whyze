const {
  patientMedicalAdded,
  patientMedicalUpdated,
} = require('../../appConstants/displayConstant');
const { conditionService, ICDService } = require('../../services');

const getAllMyMedicalCondition = async (req, res) => {
  try {
    const conditionList = await conditionService.getAllMedicalCondition(
      req.userProfile.userId,
    );
    return res.status(200).send({ data: conditionList });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getMyMedicalConditionById = async (req, res) => {
  try {
    const conditionList = await conditionService.getMedicalConditionById(
      req.userProfile.userId,
      req.params.id,
    );
    return res.status(200).send({ data: conditionList });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const createMedicalCondition = async (req, res) => {
  try {
    const reqBody = req.body;
    await conditionService.createMedicalCondition(
      reqBody,
      req.userProfile.userId,
    );
    return res.status(200).send(patientMedicalAdded);
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updateMedicalCondition = async (req, res) => {
  try {
    const conditionId = req.params.id;
    const reqBody = req.body;
    await conditionService.updateMedicalCondition(
      conditionId,
      reqBody,
      req.userProfile.userId,
    );
    return res.status(200).send(patientMedicalUpdated);
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};
const getMasterMedicalCondition = async (req, res) => {
  try {
    const { name } = req.query;

    const result = await ICDService.getConditions(name);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
module.exports = {
  createMedicalCondition,
  getAllMyMedicalCondition,
  getMasterMedicalCondition,
  getMyMedicalConditionById,
  updateMedicalCondition,
};
