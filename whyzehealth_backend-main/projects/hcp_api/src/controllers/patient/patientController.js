const {
  noPatientFound,
  success,
  updateAllergies,
  patientAllergyAdd,
  familyDetailsAdd,
  familyDetailsUpdate,
  patientFamilyDelete,
  patientAllergyDelete,
} = require('../../appConstants/displayConstant');
const { patientService } = require('../../services');
const {
  heightConversion,
  weightConversion,
} = require('../../utils/parametersConversion');
const { dateFormatter } = require('../../utils/dateUtils');

const getPatientDetails = async (req, res) => {
  try {
    const data = await patientService.getMyDetails(req.userProfile.userId);
    if (data != null) {
      return res.status(200).json({ data });
    }
    return res.status(404).send({ message: noPatientFound });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getFamilyHistory = async (req, res) => {
  try {
    const data = await patientService.getPatientFamilyHistory(
      req.userProfile.userId,
    );

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const deleteFamilyHistory = async (req, res) => {
  try {
    const { id } = req.params;
    await patientService.removePatientFamilyHistory(id);

    return res.status(200).send({ message: patientFamilyDelete });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const deletePatientAllergies = async (req, res) => {
  try {
    const { id } = req.params;
    await patientService.removePatientAllergies(id);

    return res.status(200).send({ message: patientAllergyDelete });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const updateFamilyHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const bodyObj = {
      patient: req.userProfile.userId,
      relation: body?.relation_master_id,
      name: body?.name,
      patient_medical_condition: body?.patient_medical_condition,
      icd10_code: body?.icd10_code,
      further_comments: body?.further_comments,
    };
    await patientService.updateFamilyHistoryData(
      id,
      bodyObj,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: familyDetailsUpdate });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const addFamilyHistory = async (req, res) => {
  try {
    const { body } = req;
    const bodyObj = {
      patient: req.userProfile.userId,
      relation: body?.relation_master_id,
      name: body?.name,
      icd10_code: body?.icd10_code,
      patient_medical_condition: body?.patient_medical_condition,
      further_comments: body?.further_comments,
    };

    await patientService.addFamilyHistoryDetails(
      bodyObj,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: familyDetailsAdd });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const updatePatientAllergies = async (req, res) => {
  try {
    const { id } = req.params;
    await patientService.updatePatientAllergiesData(
      id,
      req.body,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: updateAllergies });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const addPatientAllergies = async (req, res) => {
  try {
    await patientService.addPatientAllergiesData(
      req.body,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: patientAllergyAdd });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const getPatientAllergies = async (req, res) => {
  try {
    const data = await patientService.getPatientAllergies(
      req.userProfile.userId,
    );

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error?.message || '' });
  }
};
// const getMyDetailsById = () => getMyDetails();

const updateUserDetails = async (req, res) => {
  const reqBody = req.body;
  const { id } = req.params;
  try {
    await patientService.updateUserDetails(id, reqBody, req.userProfile.userId);
    return res.status(200).send({
      message: success,
    });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const savePersonalDetails = async (req, res) => {
  try {
    const { body } = req;
    body.height =
      body.height &&
      body.height_unit &&
      heightConversion(body.height, body.height_unit);
    body.weight =
      body.weight &&
      body.weight_unit &&
      weightConversion(body.weight, body.weight_unit);

    const userObj = {
      first_name: body?.first_name,
      last_name: body?.last_name,
      dob: body.dob && dateFormatter(body?.dob),
      gender: body?.gender,
      country: body?.country,
      address_line1: body?.address_line1,
      address_line2: body?.address_line2,
      address_line3: body?.address_line3,
      city: body?.city,
      post_code: body?.post_code,
    };

    const patientObj = {
      ethnicity: body?.ethnicity,
      height: body?.height,
      height_unit: body?.height_unit,
      weight: body?.weight,
      weight_unit: body?.weight_unit,
      bmi: body?.bmi,
      blood_type: body?.blood_type,
    };

    await patientService.updatePatientDetails(
      patientObj,
      req.userProfile.userId,
    );
    await patientService.updateUserDetails(userObj, req.userProfile.userId);
    return res.status(200).send({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getProfileCompletionStatus = async (req, res) => {
  const { userId } = req.userProfile;
  try {
    const data = await patientService.getProfileCompletionStepByUserId(userId);
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const updateProfileCompletionStatus = async (req, res) => {
  const { progress } = req.body;
  const { userId } = req.userProfile;

  try {
    await patientService.updateProfileCompletionStepByUserId(userId, progress);
    return res
      .status(200)
      .send({ message: 'Profile completion status updated' });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const getMasterAllergies = async (req, res) => {
  try {
    const { name } = req.query;
    const result = await patientService.getMasterAllergiesDetails(name);
    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const getMasterRealtionship = async (req, res) => {
  try {
    const { name } = req.query;

    const result = await patientService.getMasterRealtionship(name);
    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const getMasterCase = async (req, res) => {
  try {
    const { index, offset, orderBy, descending } = req.query;

    if (!index || !offset) {
      return res.sendStatus(400);
    }

    const result = await patientService.getMasterCaseDetails({
      index,
      offset,
      orderBy,
      descending,
    });

    return res.status(200).send({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const getAllFAQ = async (req, res) => {
  try {
    const faqs = await patientService.getFAQ();
    return res.status(200).send({ faqs });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const getMasterReaction = async (req, res) => {
  try {
    const { name } = req.query;

    const result = await patientService.getMasterReactionDetails(name);
    return res.status(200).send({ data: result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
module.exports = {
  getPatientDetails,
  // getMyDetailsById,
  updateFamilyHistory,
  savePersonalDetails,
  getPatientAllergies,
  addPatientAllergies,
  updateUserDetails,
  updatePatientAllergies,
  getMasterAllergies,
  addFamilyHistory,
  getFamilyHistory,
  getProfileCompletionStatus,
  updateProfileCompletionStatus,
  deleteFamilyHistory,
  deletePatientAllergies,
  getMasterRealtionship,
  getMasterCase,
  getAllFAQ,
  getMasterReaction,
};
