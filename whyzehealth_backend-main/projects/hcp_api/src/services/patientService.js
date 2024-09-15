const {
  insuranceProviderAlreadyExists,
  insurancePlanAlreadyExists,
  noAllergies,
  norelation,
  noReaction,
} = require('../appConstants/displayConstant');
const {
  Patient,
  User,
  PatientAllergies,
  AddPatientFamilyHistory,
  PatientHealthInsurance,
  HealthInsuranceMaster,
  HealthInsurancePlanMaster,
  Preference,
  AllergiesMaster,
  FamilyRealtionshipMaster,
  CaseShema,
  Faq,
  ReactionMaster,
} = require('../models');
const {
  getWeightConversion,
  getHeightConversion,
} = require('../utils/parametersConversion');
const { listOfUserTenants } = require('./tenantService');
const { dateformatToStringddmmyy } = require('../utils/dateUtils');

const formatUserDetails = userDetails => {
  const preference = userDetails?.preference ?? {};
  const patientDetail = userDetails?.patient_detail ?? {};

  const result = {
    id: userDetails?._id,
    email: userDetails?.email || '',
    email_verified: userDetails?.email_verified || false,
    phone_number: userDetails?.phone_number || '',
    role: userDetails?.role,
    is_preference_added: !!(
      preference.surveys ||
      preference.clinical_trials ||
      preference.pseudonymised_data
    ),
    country: userDetails?.country || '',
    dob: userDetails?.dob ? dateformatToStringddmmyy(userDetails?.dob) : '',
    first_name: userDetails?.first_name || '',
    gender: userDetails?.gender || '',
    last_name: userDetails?.last_name || '',
    address_line1: userDetails?.address_line1 || '',
    address_line2: userDetails?.address_line2 || '',
    address_line3: userDetails?.address_line3 || '',
    city: userDetails?.city || '',
    post_code: userDetails?.post_code || '',
    patient_id: patientDetail?._id || null,
    dietary:
      patientDetail?.dietary.map(val => ({
        dietary_id: val._id,
        name: val.name,
      })) || [],
    blood_type: patientDetail?.blood_type || '',
    bmi: patientDetail?.bmi || '',
    ethnicity: patientDetail?.ethnicity || '',
    height_unit: patientDetail?.height_unit || '',
    weight_unit: patientDetail?.weight_unit || '',
    alcohol_weekly_frequency: patientDetail?.alcohol_weekly_frequency || '',
    is_smoker: patientDetail?.is_smoker || false,
    smoke_frequency: patientDetail?.smoke_frequency || '',
    smoke_quite_year: patientDetail?.smoke_quite_year || '',
    smoke_start_year: patientDetail?.smoke_start_year || '',
    tenants: patientDetail?.tenants || [],
    hcp_list: patientDetail?.hcp_list || [],
    vaccine_list: patientDetail?.vaccine_list || [],
    relation: patientDetail?.relation || '',
    progress: patientDetail?.progress || [],
    height:
      (patientDetail.height &&
        patientDetail.height_unit &&
        getHeightConversion(patientDetail.height, patientDetail.height_unit)) ||
      '',
    weight:
      (patientDetail.weight &&
        patientDetail.weight_unit &&
        getWeightConversion(patientDetail.weight, patientDetail.weight_unit)) ||
      '',
  };

  return result;
};

const updatePatientDetails = async (patientObj, user_id) => {
  try {
    return Patient.updateOne(
      { patient: user_id },
      { ...patientObj, updated_by: user_id },
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUserDetails = async (userObj, user_id) => {
  try {
    return User.updateOne(
      { _id: user_id },
      { ...userObj, updated_by: user_id },
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const removePatientFamilyHistory = async Id => {
  // eslint-disable-next-line no-useless-catch
  try {
    return AddPatientFamilyHistory.deleteOne({ _id: Id });
  } catch (error) {
    throw error;
  }
};
const removePatientAllergies = async Id => {
  // eslint-disable-next-line no-useless-catch
  try {
    return PatientAllergies.deleteOne({ _id: Id });
  } catch (error) {
    throw error;
  }
};

const getMyDetails = async userId => {
  try {
    const userDetails = await User.findById(userId)
      .select(
        '-password -tenant -email_verification_token -created_on -updated_on -__v',
      )
      .populate([
        {
          path: 'patient_detail',
          model: 'Patient',
          select: '-created_on -updated_on -__v',
          populate: {
            path: 'dietary',
            model: 'DietaryMaster',
            select: 'dietary_id name',
          },
        },
        {
          path: 'preference',
          model: 'Preference',
          select: '-_id -created_on -updated_on -__v',
        },
      ]);

    const result = formatUserDetails(userDetails);

    const tenant = await listOfUserTenants(userId);
    result.tenant = [...tenant];

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateFamilyHistoryData = async (id, patientObj, user_id) => {
  try {
    return AddPatientFamilyHistory.updateOne(
      { _id: id },
      { ...patientObj, updated_by: user_id },
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addFamilyHistoryDetails = async (bodyObj, userId) => {
  try {
    return AddPatientFamilyHistory.create({
      ...bodyObj,
      created_by: userId,
      updated_by: userId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updatePatientAllergiesData = async (id, patientObj, user_id) => {
  try {
    return PatientAllergies.updateOne(
      { _id: id },
      {
        allergy: patientObj.allergy,
        reactions: patientObj.reactions,
        comment: patientObj.comment,
        is_active: patientObj.is_active,
        created_by: user_id,
        updated_by: user_id,
      },
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getPatientFamilyHistory = async userId => {
  try {
    const patientFamilyHistoryData = await AddPatientFamilyHistory.find({
      patient: userId,
    })
      .select('-created_on -updated_on -__v -created_by -updated_by')
      .populate([
        {
          path: 'relation',
          model: 'FamilyRealtionshipMaster',
          select: '-created_on -updated_on -__v -created_by -updated_by _id',
        },
      ]);

    const patientFamilyHistoryDetailsData = patientFamilyHistoryData.map(
      ele => ({
        patient_family_details_id: ele._id,
        relation: ele.relation?.name,
        relation_master_id: ele.relation?.family_realtionship_master_id,
        name: ele?.name,
        medical_condition: ele.patient_medical_condition,
        is_active: ele?.is_active,
        further_comments: ele.further_comments,
      }),
    );
    return patientFamilyHistoryDetailsData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPatientAllergies = async userId => {
  try {
    const patientAllergiesData = await PatientAllergies.find({
      patient: userId,
    })
      .select('-created_on -updated_on -__v -created_by -updated_by')
      .populate([
        {
          path: 'allergy',
          model: 'AllergiesMaster',
          select: '-created_on -updated_on -__v -created_by -updated_by _id',
        },
        {
          path: 'reactions',
          model: 'ReactionMaster',
          select: '-created_on -updated_on -__v -created_by -updated_by _id',
        },
      ]);

    const listOfPatientAllergies = patientAllergiesData.map(ele => ({
      patient_allergies_id: ele.patient_allergies_id,
      allergy: ele?.allergy?.name,
      allergy_master_id: ele?.allergy?.allergies_master_id,
      reactions: ele?.reactions.map(elem => ({
        reaction_master_id: elem?.reaction_master_id,
        name: elem?.name,
      })),
      comment: ele?.comment,
      status: ele?.status,
      is_active: ele?.is_active,
    }));
    return listOfPatientAllergies;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMasterAllergiesDetails = async name => {
  try {
    const regexValue = new RegExp(name, 'i');
    const query = name ? { name: { $regex: regexValue } } : {};

    const result = await AllergiesMaster.find(query).select(
      '-created_by -updated_by -created_on -updated_on -__v',
    );
    if (!result.length) {
      throw new Error(noAllergies);
    }
    const transformedResult = result.map(ele => ({
      allergies_master_id: ele._id,
      name: ele?.name,
    }));

    return transformedResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addPatientAllergiesData = async (caseObj, userId) => {
  try {
    return PatientAllergies.create({
      patient: userId,
      allergy: caseObj.allergy,
      reactions: caseObj.reactions,
      comment: caseObj.comment,
      is_active: caseObj.isActive,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updatePreferenceData = async (id, patientObj, user_id) => {
  try {
    return Preference.updateOne(
      { patient: id },
      { ...patientObj, updated_by: user_id },
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getMasterRealtionship = async value => {
  try {
    const regexValue = new RegExp(value, 'i');
    const query = value ? { name: { $regex: regexValue } } : {};

    const result = await FamilyRealtionshipMaster.find(query).select(
      '-created_by -updated_by -updated_on -__v -created_on',
    );

    if (result.length === 0) {
      return { message: norelation };
    }
    return result.map(({ family_realtionship_master_id, name }) => ({
      family_realtionship_master_id,
      name,
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const formatMyHIData = ({
  patient_health_insurance_id,
  has_medical_card,
  policy_number,
  pps_number,
  gms_number,
  health_insurance,
  health_insurance_plan,
}) => {
  const result = {
    patient_health_insurance_id,
    has_medical_card,
    policy_number,
    pps_number,
    gms_number,
    is_custom_added: !health_insurance?.is_system_added,
    health_insurance_id: health_insurance?._id,
    health_insurance_name: health_insurance?.name,
    health_insurance_plan_id: health_insurance_plan?._id,
    health_insurance_plan_name: health_insurance_plan?.name,
  };

  return result;
};

const getMyHIData = async user_id => {
  try {
    const patientHealthInsurance = await PatientHealthInsurance.findOne({
      user: user_id,
    })
      .select('-user -created_on -updated_on -__v -created_by -updated_by')
      .populate([
        {
          path: 'health_insurance',
          model: 'HealthInsuranceMaster',
          select:
            '-created_on -updated_on -__v -created_by -updated_by -is_deleted _id ',
        },
        {
          path: 'health_insurance_plan',
          model: 'HealthInsurancePlanMaster',
          select:
            '-created_on -updated_on -__v -created_by -updated_by -is_deleted _id',
        },
      ]);

    const result =
      patientHealthInsurance && formatMyHIData(patientHealthInsurance);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMyHIDataById = async patient_health_insurance_id => {
  try {
    return PatientHealthInsurance.findById(patient_health_insurance_id)
      .select('-user -created_on -updated_on -__v -created_by -updated_by')
      .populate([
        {
          path: 'health_insurance',
          model: 'HealthInsuranceMaster',
          select:
            '-created_on -updated_on -__v -created_by -updated_by -is_deleted _id ',
        },
        {
          path: 'health_insurance_plan',
          model: 'HealthInsurancePlanMaster',
          select:
            '-created_on -updated_on -__v -created_by -updated_by -is_deleted _id',
        },
      ]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createPatientHIData = async ({
  user_id,
  health_insurance_plan_id,
  health_insurance_id,
  policy_number,
  pps_number,
  gms_number,
  has_medical_card,
  health_insurance_provider,
  health_insurance_plan,
}) => {
  try {
    const patientHealthInsuranceObj = {
      user: user_id,
      policy_number,
      pps_number,
      has_medical_card,
    };

    if (has_medical_card) {
      patientHealthInsuranceObj.gms_number = gms_number;
    } else {
      patientHealthInsuranceObj.$unset = { gms_number: 1 };
    }

    if (health_insurance_provider && health_insurance_plan) {
      const isHealthInsuranceExist = await HealthInsuranceMaster.exists({
        name: health_insurance_provider,
      });
      const isHealthInsurancePlanExist = await HealthInsurancePlanMaster.exists(
        {
          name: health_insurance_plan,
        },
      );

      if (!isHealthInsuranceExist && !isHealthInsurancePlanExist) {
        const healthInsuranceMaster = await HealthInsuranceMaster.create({
          name: health_insurance_provider,
          is_system_added: false,
          created_by: user_id,
          updated_by: user_id,
        });

        const healthInsurancePlanMaster =
          await HealthInsurancePlanMaster.create({
            health_insurance: healthInsuranceMaster.health_insurance_master_id,
            name: health_insurance_plan,
            created_by: user_id,
            updated_by: user_id,
          });

        patientHealthInsuranceObj.health_insurance =
          healthInsuranceMaster.health_insurance_master_id;
        patientHealthInsuranceObj.health_insurance_plan =
          healthInsurancePlanMaster.health_insurance_plan_master_id;
      }

      if (isHealthInsuranceExist) {
        throw new Error(
          `${health_insurance_provider} ${insuranceProviderAlreadyExists}`,
        );
      }

      if (isHealthInsurancePlanExist) {
        throw new Error(
          `${health_insurance_plan} ${insurancePlanAlreadyExists}`,
        );
      }
    } else {
      patientHealthInsuranceObj.health_insurance_plan =
        health_insurance_plan_id;
      patientHealthInsuranceObj.health_insurance = health_insurance_id;
    }

    const result = await PatientHealthInsurance.updateOne(
      { user: user_id },
      patientHealthInsuranceObj,
      { new: true, upsert: true },
    );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updatePatientHIData = async ({
  user_id,
  health_insurance_plan_id,
  health_insurance_id,
  policy_number,
  pps_number,
  gms_number,
  has_medical_card,
  health_insurance_provider,
  health_insurance_plan,
  patient_health_insurance_id,
}) => {
  const patientHealthInsuranceObj = {
    user: user_id,
    policy_number,
    pps_number,
    has_medical_card,
  };

  if (has_medical_card) {
    patientHealthInsuranceObj.gms_number = gms_number;
  } else {
    patientHealthInsuranceObj.$unset = { gms_number: 1 };
  }

  if (health_insurance_provider && health_insurance_plan) {
    const patientHealthInsurance = await getMyHIDataById(
      patient_health_insurance_id,
    );
    if (!patientHealthInsurance.health_insurance.is_system_added) {
      await HealthInsuranceMaster.updateOne(
        {
          _id: patientHealthInsurance.health_insurance
            .health_insurance_master_id,
        },
        {
          name: health_insurance_provider,
          updated_by: user_id,
        },
      );

      await HealthInsurancePlanMaster.updateOne(
        {
          _id: patientHealthInsurance.health_insurance_plan
            .health_insurance_plan_master_id,
        },
        {
          name: health_insurance_plan,
          updated_by: user_id,
        },
      );

      return PatientHealthInsurance.updateOne(
        { user: user_id },
        patientHealthInsuranceObj,
        { new: true, upsert: true },
      );
    }
    return createPatientHIData({
      user_id,
      policy_number,
      pps_number,
      gms_number,
      has_medical_card,
      health_insurance_provider,
      health_insurance_plan,
    });
  }
  patientHealthInsuranceObj.health_insurance = health_insurance_id;
  patientHealthInsuranceObj.health_insurance_plan = health_insurance_plan_id;

  return PatientHealthInsurance.updateOne(
    { user: user_id },
    patientHealthInsuranceObj,
    { new: true, upsert: true },
  );
};
const getMasterCaseDetails = async ({
  index,
  offset,
  orderBy = [],
  descending = 1,
  userId,
}) => {
  try {
    let orderByTemp = orderBy;
    if (typeof orderBy === 'string') {
      orderByTemp = [orderBy];
    }

    const sortFields = orderByTemp.reduce(
      (obj, field) => ({ ...obj, [field]: descending ? -1 : 1 }),
      {},
    );
    const query = CaseShema.find({
      patient: userId,
    })
      .sort(sortFields)
      .skip(index)
      .limit(offset)
      .select('-created_by -updated_by -created_on -updated_on -__v')
      .select('type');

    const results = await query.exec();

    const formattedResults = results.map(result => ({
      ...result.toObject({ getters: true }),
      userId,
    }));

    return formattedResults;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getPatientByUserId = async user_id => {
  try {
    const result = await Patient.findOne({ patient: user_id });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getProfileCompletionStepByUserId = async userId => {
  try {
    const patientData = await Patient.findOne({ patient: userId }).select(
      'progress -_id',
    );
    const clinical_trials = await Preference.findOne({
      patient: userId,
    }).select('clinical_trials');
    return {
      clinical_trials: clinical_trials.clinical_trials,
      progress: patientData.progress,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateProfileCompletionStepByUserId = async (userId, progress) => {
  try {
    return Patient.updateOne({ patient: userId }, { progress });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getFAQ = async () => {
  try {
    const result = await Faq.find({}).select(
      '-created_by -updated_by -created_on -updated_on -__v',
    );
    return result.map(({ faq_id, question_title, answer_text }) => ({
      faq_id,
      question_title,
      answer_text,
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getMasterReactionDetails = async name => {
  try {
    const regexValue = new RegExp(name, 'i');
    const query = name ? { name: { $regex: regexValue } } : {};
    const result = await ReactionMaster.find(query).select(
      '-created_by -updated_by -created_on -updated_on -__v',
    );

    if (!result.length) {
      throw new Error(noReaction);
    }
    const transformedResult = result.map(ele => ({
      reaction_master_id: ele._id,
      name: ele?.name,
    }));

    return transformedResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPatientDetailsByEmail = async ({ email }) => {
  try {
    return User.findOne({ email, role: 'patient' }).select(
      '-password -tenant -email_verification_token -created_on -updated_on -__v',
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getPatientDetailsByEmail,
  updatePatientDetails,
  getMyDetails,
  updateUserDetails,
  addPatientAllergiesData,
  updatePatientAllergiesData,
  addFamilyHistoryDetails,
  getPatientAllergies,
  updateFamilyHistoryData,
  createPatientHIData,
  updatePreferenceData,
  getPatientByUserId,
  getPatientFamilyHistory,
  getProfileCompletionStepByUserId,
  updateProfileCompletionStepByUserId,
  getMyHIData,
  updatePatientHIData,
  removePatientFamilyHistory,
  removePatientAllergies,
  getMasterAllergiesDetails,
  getMasterRealtionship,
  getMasterCaseDetails,
  getFAQ,
  getMasterReactionDetails,
};
