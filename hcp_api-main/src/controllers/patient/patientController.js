const {
  noPatientFound,
  success,
  updateAllergies,
  patientAllergyAdd,
  familyDetailsAdd,
  familyDetailsUpdate,
  patientFamilyDelete,
  patientAllergyDelete,
  updateAccessSettings,
  fieldMissing,
  sentAccessSharingInvite,
  sharingAccessRemoved,
  profileUploadSuccessfully,
} = require('../../appConstants/displayConstant');
const { errorConstants } = require('../../appConstants/errorConstant');
const { patientService, masterService } = require('../../services');
const {
  heightConversion,
  weightConversion,
} = require('../../utils/parametersConversion');
const { dateFormatter } = require('../../utils/dateUtils');

const getPatientDetails = async (req, res) => {
  try {
    const data = await patientService.getMyDetails(
      req.userProfile.userId,
      req.userProfile?.adminId,
    );
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
    const { body, file } = req;
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
      nhs_number: body?.nhs_number,
      profileImage: file,
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

const getAllCountries = async (req, res) => {
  try {
    const { name } = req.query;
    const countryList = await masterService.getAllCountriesList(name);
    return res.status(200).send({ data: countryList });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const addFamilyAccount = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      relation,
      isNewAccount,
      dob,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !relation ||
      isNewAccount === undefined
    ) {
      return res.status(400).send({ message: fieldMissing });
    }
    const familyAccountDetails = await patientService.addFamilyAccountDetails({
      firstName,
      lastName,
      email,
      isNewAccount,
      phoneNumber,
      relation,
      senderUserId: req.userProfile.adminId || req.userProfile.userId,
      profileImage: req?.file,
      dob,
    });

    res.status(200).send({
      message: success,
      familyAccountDetails,
    });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getFamilyMemberAccounts = async (req, res) => {
  try {
    const { userId } = req.userProfile;
    const accountsList = await patientService.getFamilyAccountDetails({
      patient: userId,
      isOrganizationAdmin: req?.userProfile?.adminId,
    });
    return res.status(200).send({ accountsList });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const updateFamilyMemberAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, relation, dob } = req.body;
    const { id } = req.params;
    const patientObj = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      relation,
      dob,
    };
    await patientService.updateFamilyAccountDetails({
      patientObj,
      profileImage: req?.file,
      userId: id,
    });

    return res.status(200).send({
      message: profileUploadSuccessfully,
    });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const deleteFamilyMemberAccount = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new Error(errorConstants.patientIdRequired);
    }

    const message = await patientService.deleteFamilyAccountsDetails({
      adminId: req.userProfile.adminId || req.userProfile.userId,
      patient: req.params.id,
    });

    return res.status(200).send({ message });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const switchLinkedAccount = async (req, res) => {
  try {
    const { switcherAccountId } = req.body;
    if (!switcherAccountId) {
      throw new Error(errorConstants.switcherAccountRequired);
    }
    const switchedAccountToken = await patientService.swithLoginAccount({
      switcherAccountId,
      adminAccountId: req.userProfile.adminId || req.userProfile.userId,
    });
    return res.status(200).send(switchedAccountToken);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const getAccessSettingsById = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new Error(errorConstants.patientIdRequired);
    }
    const accessSettings = await patientService.getAccessSettingsById({
      accountId: req.params.id,
      userId: req.userProfile.userId,
    });
    return res.status(200).send({ data: accessSettings });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const updateAccessSettingsById = async (req, res) => {
  try {
    const reqBody = req.body;
    if (!req.params.id) {
      throw new Error(errorConstants.patientIdRequired);
    }
    await patientService.updateAccessSettings({
      accountId: req.params.id,
      userId: req.userProfile.userId,
      reqBody,
    });
    return res.status(200).send({ message: updateAccessSettings });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const getFamilyAccountHistory = async (req, res) => {
  try {
    if (!req.userProfile.userId) {
      throw new Error(errorConstants.patientIdRequired);
    }
    const familyAccountHistory = await patientService.getFamilyAccountHistory({
      accountId: req.userProfile.userId,
    });
    return res.status(200).send(familyAccountHistory);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const createShareAccessAccount = async (req, res) => {
  try {
    if (!req.userProfile.userId) {
      throw new Error(errorConstants.patientIdRequired);
    }
    const { email, firstName, lastName } = req.body;
    if (!email) {
      throw new Error(errorConstants.patientIdRequired);
    }
    const familyAccountHistory = await patientService.memberSharingAccount({
      email,
      firstName,
      lastName,
      senderUser: req.userProfile.userId,
    });
    res.status(200).send({
      message: sentAccessSharingInvite,
      familyAccountHistory,
    });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const removeSharingAccess = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new Error(errorConstants.patientIdRequired);
    }
    await patientService.removeSharingAccount({
      adminAccountId: req.params.id,
      removeAccountId: req.userProfile.userId,
    });
    return res.status(200).send({ message: sharingAccessRemoved });
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
  getAllCountries,
  addFamilyAccount,
  getFamilyMemberAccounts,
  deleteFamilyMemberAccount,
  switchLinkedAccount,
  getAccessSettingsById,
  updateAccessSettingsById,
  getFamilyAccountHistory,
  createShareAccessAccount,
  removeSharingAccess,
  updateFamilyMemberAccount,
};
