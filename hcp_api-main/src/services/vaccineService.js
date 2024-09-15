const { default: axios } = require('axios');
const { conditionAlreadyExists } = require('../appConstants/displayConstant');
const { VaccineMaster, PatientVaccineMapper } = require('../models');
const { getPatientByUserId } = require('./patientService');

const formatVaccinesList = async vaccineList => {
  const result = vaccineList.map(patientVaccineMapper => ({
    patient_vaccine_mapper_id: patientVaccineMapper._id,
    patient: patientVaccineMapper?.patient,
    condition: patientVaccineMapper?.condition,
    vaccines: patientVaccineMapper.vaccines.map(vaccine => ({
      vaccine_id: vaccine?._id,
      name: vaccine?.name,
      date: vaccine?.date,
    })),
  }));

  return result;
};

const checkNameExists = async name => {
  try {
    const isExist = await VaccineMaster.exists({ name });
    return !!isExist;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllVaccines = async condition_name => {
  try {
    const searchUri = `${process.env.GET_VACCINES_RELATED_TO_CONDITION_URL}/${process.env.VACCINES_FUCNTION_NAME}?code=${process.env.VACCINES_CODE}==&name=${condition_name}`;
    const headers = { Accept: 'application/json' };

    const vaccinesList = await axios.get(searchUri, { headers });
    return vaccinesList.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// In the future, this can be used to get vaccinations by condition ID
// const getVaccinesByCondition = async condition => {
//   try {
//     console.log(condition);
//     const vaccinesList = await VaccineMaster.find({
//       condition,
//     }).select('_id name condition');
//     return vaccinesList;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

const createVaccine = async (vaccineObj, user_id) => {
  try {
    const nameExists = await checkNameExists(vaccineObj.name);
    if (nameExists) {
      throw new Error(`${vaccineObj.name} is already exists`);
    }
    return await VaccineMaster.create({
      ...vaccineObj,
      created_by: user_id,
      updated_by: user_id,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// In the future, this can be used to get vaccinations by condition ID
// const getMyVaccinesByCondition = async (patient_id, condition) => {
//   try {
//     const patientVaccineList = await PatientVaccineMapper.find({
//       patient: patient_id,
//       condition,
//     })
//       .select(
//         '-id -patient -created_by -updated_by -__v -created_on -updated_on',
//       )
//       .populate([
//         {
//           path: 'vaccine',
//           model: 'vaccineMaster',
//           select: '-created_by -updated_by -created_on -updated_on -__v',
//         },
//       ]);

//     return patientVaccineList;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

const getMyVaccines = async (patient_id, condition) => {
  try {
    const query = condition
      ? { patient: patient_id, condition }
      : { patient: patient_id };

    const patientVaccineList = await PatientVaccineMapper.find(query).select(
      '-created_by -updated_by -__v -created_on -updated_on',
    );

    const result = formatVaccinesList(patientVaccineList);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createPatientVaccineMap = async data => {
  try {
    const { vaccineData, condition, user_id, patient_id } = data;
    const isExists = await PatientVaccineMapper.exists({
      patient: patient_id,
      condition,
    });

    if (isExists) {
      throw new Error(`${condition} ${conditionAlreadyExists}`);
    }

    const createdPatientVaccine = await PatientVaccineMapper.create(
      vaccineData,
    );

    const patient = await getPatientByUserId(user_id);
    patient.vaccine_list.addToSet(createdPatientVaccine._id);

    await patient.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updatePatientVaccineMap = async data => {
  try {
    const { vaccineData, patient_id, condition, patient_vaccine_mapper_id } =
      data;

    const patientVaccineMapperData = await PatientVaccineMapper.findOne({
      _id: patient_vaccine_mapper_id,
      patient: patient_id,
    });

    if (patientVaccineMapperData.condition !== condition) {
      const isExists = await PatientVaccineMapper.exists({
        patient: patient_id,
        condition,
      });

      if (isExists) {
        throw new Error(`${condition} ${conditionAlreadyExists}`);
      }
    }

    return PatientVaccineMapper.updateOne(
      {
        _id: patient_vaccine_mapper_id,
        patient: patient_id,
      },
      vaccineData,
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const getVaccinesConditionByName = async condition => {
  const searchUri = `${process.env.GET_CONDITION_URL}/${process.env.VACCINES_CONDITION_FUCNTION_NAME}?code=${process.env.CONDITION_CODE}==&name=${condition}`;
  const headers = { Accept: 'application/json' };
  try {
    return (await axios.get(searchUri, { headers })).data;
  } catch (error) {
    console.error(error);
    throw error;
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
  getVaccinesConditionByName,
};
