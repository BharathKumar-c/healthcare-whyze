const { conditionAlreadyExists } = require('../appConstants/displayConstant');
const { VaccineMaster, PatientVaccineMapper } = require('../models');
const { getPatientByUserId } = require('./patientService');

const formatVaccinesList = async vaccineList => {
  const result = vaccineList.map(patientVaccineMapper => ({
    patient_vaccine_mapper_id: patientVaccineMapper._id,
    patient: patientVaccineMapper?.patient,
    condition: patientVaccineMapper?.condition,
    vaccines: patientVaccineMapper.vaccines.map(vaccine => ({
      vaccine_id: vaccine?._id?._id,
      name: vaccine?._id?.name,
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
    console.log(error);
    throw error;
  }
};

const getAllVaccines = async condition_name => {
  try {
    const query = condition_name ? { condition: condition_name } : {};
    const vaccinesList = await VaccineMaster.find(query).select(
      'vaccine_master_id name condition',
    );
    return vaccinesList.map(({ vaccine_master_id, name, condition }) => ({
      vaccine_master_id,
      name,
      condition,
    }));
  } catch (error) {
    console.log(error);
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
//     console.log(error);
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
    console.log(error);
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
//     console.log(error);
//     throw error;
//   }
// };

const getMyVaccines = async (patient_id, condition) => {
  try {
    const query = condition
      ? { patient: patient_id, condition }
      : { patient: patient_id };

    const patientVaccineList = await PatientVaccineMapper.find(query)
      .select('-created_by -updated_by -__v -created_on -updated_on')
      .populate({
        path: 'vaccines._id',
        model: 'vaccineMaster',
        select: 'name',
      });

    const result = formatVaccinesList(patientVaccineList);

    return result;
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
};
