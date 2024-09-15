const { medicationService } = require('../../services');
const {
  patientMedicationAdded,
  patientMedicationUpdated,
  patientMedicationDeleted,
} = require('../../appConstants/displayConstant');

const getAllMyMedication = async (req, res) => {
  try {
    const medicationResult = await medicationService.getAllPatientMedication(
      req.userProfile.userId,
    );
    return res.status(200).send({ data: medicationResult });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getMyMedicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicationResult = await medicationService.getPatientMedication(
      id,
      req.userProfile.userId,
    );
    return res.status(200).send({ data: medicationResult });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const createPatientMedication = async (req, res) => {
  try {
    const reqBody = req.body;
    await medicationService.createPatientMedication(
      reqBody,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: patientMedicationAdded });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updatePatientMedication = async (req, res) => {
  try {
    const reqBody = req.body;
    const { id } = req.params;
    await medicationService.updatePatientMedication(
      reqBody,
      id,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: patientMedicationUpdated });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deletePatientMedication = async (req, res) => {
  try {
    const { id } = req.params;
    await medicationService.deletePatientMedication(id, req.userProfile.userId);
    return res.status(200).send({ message: patientMedicationDeleted });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};
const getMasterMedication = async (req, res) => {
  try {
    const { name } = req.query;
    const result = await medicationService.getMedicationList(name);
    return res.status(200).send({ data: result });
  } catch (error) {
    console.log('Error :', error);
    return res.status(500).send({ message: error?.message || '' });
  }
};
module.exports = {
  createPatientMedication,
  updatePatientMedication,
  getAllMyMedication,
  getMyMedicationById,
  deletePatientMedication,
  getMasterMedication,
};
