const { success } = require('../../appConstants/displayConstant');
const { vaccineService } = require('../../services');

const getAllVaccines = async (req, res) => {
  try {
    const { condition } = req.query;
    const vaccinesList = await vaccineService.getAllVaccines(condition);
    return res.status(200).send({ data: vaccinesList });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

// In the future, this can be used to get vaccinations by condition ID
// const getVaccinesByCondition = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const vaccinesList = await vaccineService.getVaccinesByCondition(id);

//     return res.status(200).send({ data: vaccinesList });
//   } catch (error) {
//     console.log('Error:', error);
//     return res.status(500).send({
//       message: error.message,
//     });
//   }
// };

const createVaccine = async (req, res) => {
  try {
    const { body } = req;

    await vaccineService.createVaccine(body, req.userProfile.userId);

    return res.status(200).send({ message: success });
  } catch (error) {
    console.log('Error:', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

// In the future, this can be used to get vaccinations by condition ID
// const getMyVaccinesByCondition = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const patientVaccinesList =
//       await vaccineService.getMyVaccinesByCondition(  req.userProfile.patientId, id);
//     return res.status(200).send({ data: patientVaccinesList });
//   } catch (error) {
//     console.log('Error:', error);
//     return res.status(500).send({
//       message: error.message,
//     });
//   }
// };

const getMyVaccines = async (req, res) => {
  try {
    const { condition } = req.query;

    const patientVaccinesList = await vaccineService.getMyVaccines(
      req.userProfile.patientId,
      condition,
    );
    return res.status(200).send({ data: patientVaccinesList });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const createPatientVaccineMap = async (req, res) => {
  try {
    const { vaccines, condition } = req.body;
    const { patientId, userId } = req.userProfile;

    const vaccineData = {
      patient: patientId,
      condition,
      vaccines,
      created_by: userId,
      updated_by: userId,
    };

    await vaccineService.createPatientVaccineMap({
      vaccineData,
      condition,
      user_id: userId,
      patient_id: patientId,
    });

    return res.status(200).send({ message: success });
  } catch (error) {
    console.log('Error:', error);
    return res.status(400).send({
      message: error.message,
    });
  }
};

const updatePatientVaccineMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { vaccines, condition } = req.body;
    const { patientId, userId } = req.userProfile;

    const vaccineData = {
      patient: patientId,
      condition,
      vaccines,
      updated_by: userId,
    };

    await vaccineService.updatePatientVaccineMap({
      vaccineData,
      condition,
      user_id: userId,
      patient_id: patientId,
      patient_vaccine_mapper_id: id,
    });

    return res.status(200).send({ message: success });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getVaccineConditions = async (req, res) => {
  try {
    const { condition } = req.query;
    if (!condition) {
      return res.status(400).send();
    }
    const vaccineConditionList =
      await vaccineService.getVaccinesConditionByName(condition);
    return res.status(200).send(vaccineConditionList);
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  getAllVaccines,
  // getVaccinesByCondition,
  createVaccine,
  getMyVaccines,
  // getMyVaccinesByCondition,
  createPatientVaccineMap,
  updatePatientVaccineMap,
  getVaccineConditions,
};
