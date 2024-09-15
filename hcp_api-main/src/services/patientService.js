/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-lines-per-function */
/* eslint-disable indent */
const moment = require('moment');
const {
  insuranceProviderAlreadyExists,
  insurancePlanAlreadyExists,
  noAllergies,
  norelation,
  giveCorrectRelationShip,
  newAccountfalse,
  accountDeleted,
  sharingAccessAccount,
  accountJoined,
  accountCreated,
  accountShared,
  someEmailMissing,
  accountRemoved,
  notAvailable,
  newAccountTrue,
  sharedAccount,
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
  LinkedAccounts,
  AccessSettings,
} = require('../models');

const {
  getWeightConversion,
  getHeightConversion,
} = require('../utils/parametersConversion');
const { listOfUserTenants } = require('./tenantService');
const { dateformatToStringddmmyy } = require('../utils/dateUtils');
const {
  getSignedUrl,
  getBufferAndFormatFromMulterFileType,
  saveInS3Bucket,
} = require('./s3Service');
const roleConstant = require('../appConstants/roleConstant');
const { s3_profile_img } = require('../config/AWS');
const { createToken } = require('./jwtService');
const { sendTemplatedEmail } = require('./emailService');
const { switchAccountAccessToken } = require('./accountService');
const { isBirthdayComingUpAndAbove18 } = require('../utils/commonFunctions');
const {
  ACCEPT_LINK_REQUEST,
  MEMBER_SHARING_ACCOUNT,
} = require('../appConstants/tokenTypeConstant');
const { defaultProfileImg } = require('../utils/DefaultData');
const { errorConstants } = require('../appConstants/errorConstant');

const formatUserDetails = async ({ userDetails, accessSettingsDetails }) => {
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
    profileImg: await getSignedUrl(
      userDetails?.picture_url || defaultProfileImg,
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
    nhs_number: userDetails?.nhs_number || '',
    patient_id: patientDetail?._id || null,
    dietary:
      patientDetail?.dietary?.map(val => ({
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
    preference_tenant: preference?.preference_tenant_mapper?.tenant
      ? {
          tenant_id: preference?.preference_tenant_mapper?.tenant?._id,
          name: preference?.preference_tenant_mapper?.tenant?.name || '',
          image:
            preference?.preference_tenant_mapper?.tenant?.image &&
            (await getSignedUrl(
              preference.preference_tenant_mapper.tenant.image,
            )),
        }
      : null,
  };
  if (accessSettingsDetails) {
    result.accessSettings = accessSettingsDetails;
  }
  return result;
};

const updatePatientDetails = async (patientObj, user_id) => {
  try {
    return Patient.updateOne(
      { patient: user_id },
      { ...patientObj, updated_by: user_id },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateUserDetails = async (userObj, user_id) => {
  try {
    const profileImageUploadedPath = `${s3_profile_img}/${user_id}`;

    if (userObj?.profileImage && typeof userObj.profileImage === 'object') {
      const { buff, format } = getBufferAndFormatFromMulterFileType(
        userObj.profileImage,
      );
      await saveInS3Bucket(format, buff, profileImageUploadedPath);
    }

    const updateData = {
      ...userObj,
      updated_by: user_id,
    };

    if (profileImageUploadedPath) {
      updateData.picture_url = profileImageUploadedPath;
    }

    return User.updateOne({ _id: user_id }, updateData);
  } catch (error) {
    console.error(error);
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
const getAccessSettingsById = async ({ accountId, userId }) => {
  try {
    const listOfSettings = await AccessSettings.findOne({
      user: userId,
      to_share_user: accountId,
    })
      .select('-created_on -updated_on -__v -created_by -updated_by')
      .populate([
        {
          path: 'user',
          model: 'User',
          select: 'first_name last_name email role _id picture_url',
        },
        {
          path: 'to_share_user',
          model: 'User',
          select: 'first_name last_name email role _id picture_url',
        },
      ]);

    if (!listOfSettings) {
      return [];
    }
    if (!listOfSettings.to_share_user.picture_url) {
      listOfSettings.to_share_user.profile_url = await getSignedUrl(
        defaultProfileImg,
      );
    }
    if (listOfSettings.to_share_user.picture_url) {
      listOfSettings.to_share_user.profile_url = await getSignedUrl(
        listOfSettings.to_share_user.picture_url,
      );
    }
    return listOfSettings;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getMyDetails = async (userId, adminId = null) => {
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
          select:
            '-_id -created_on -updated_on -__v -patient -surveys -pseudonymised_data -updated_by -created_by',
          populate: {
            path: 'preference_tenant_mapper',
            model: 'preferenceTenantMapper',
            select:
              '-created_on -updated_on -updated_by -created_by -__v -_id -preference -is_connected -travel_distance',
            populate: {
              path: 'tenant',
              model: 'Tenant',
              select: '_id name image',
            },
          },
        },
      ]);
    let accessSettingsDetails;
    if (adminId) {
      accessSettingsDetails = await getAccessSettingsById({
        accountId: userId,
      });
    }
    const result = await formatUserDetails({
      userDetails,
      accessSettingsDetails,
    });

    const tenant = await listOfUserTenants(userId);
    result.tenant = [...tenant];

    return result;
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
      ]);

    const listOfPatientAllergies = patientAllergiesData.map(ele => ({
      patient_allergies_id: ele.patient_allergies_id,
      allergy: ele?.allergy?.name,
      allergy_master_id: ele?.allergy?.allergies_master_id,
      reactions: ele?.reactions?.map(elem => ({
        reaction_master_id: elem?.id,
        name: elem.name,
      })),
      comment: ele?.comment,
      status: ele?.status,
      is_active: ele?.is_active,
    }));
    return listOfPatientAllergies;
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    return result.map(ele => ({
      family_realtionship_master_id: ele._id,
      name: ele.name ? ele.name : notAvailable,
      is_below_18: ele.is_below_18,
    }));
  } catch (error) {
    console.error(error);
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
    is_custom_added: health_insurance
      ? !health_insurance?.is_system_added
      : false,
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
    console.error(error);
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
    console.error(error);
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

// eslint-disable-next-line max-lines-per-function
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
  has_insurance,
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

  const patientHealthInsurance = await getMyHIDataById(
    patient_health_insurance_id,
  );

  /*
    In this condition, we check whether the patient added insurance or not.
  */
  if (!has_insurance) {
    patientHealthInsuranceObj.$unset = {
      ...patientHealthInsuranceObj.$unset,
      health_insurance: 1,
      health_insurance_plan: 1,
    };

    if (
      patientHealthInsurance.health_insurance &&
      !patientHealthInsurance?.health_insurance?.is_system_added
    ) {
      await HealthInsurancePlanMaster.deleteOne({
        _id: patientHealthInsurance.health_insurance_plan
          .health_insurance_plan_master_id,
        is_system_added: false,
        created_by: user_id,
      });

      await HealthInsuranceMaster.deleteOne({
        _id: patientHealthInsurance.health_insurance.health_insurance_master_id,
        is_system_added: false,
        created_by: user_id,
      });
    }
  } else {
    /*
      In this condition, we check whether the updating HI already exists or not.
    */
    if (health_insurance_provider && health_insurance_plan) {
      /*
    In this condtion, we check whether this Hi is an existing HI or a non-existent HI.

    if it is true we just update the name of health_insurance and
    health_insurance_plan  and policy number and gms_number etc...

    if it is false we creating the new health_insurance and health_insurance_plan
    and patient_health_insurance data
    */
      if (
        patientHealthInsurance.health_insurance &&
        !patientHealthInsurance?.health_insurance?.is_system_added
      ) {
        await HealthInsuranceMaster.updateOne(
          {
            _id: patientHealthInsurance.health_insurance
              .health_insurance_master_id,
            created_by: user_id,
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
            created_by: user_id,
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

    /* Adding or Changing the HI for already existing HI */
    patientHealthInsuranceObj.health_insurance = health_insurance_id;
    patientHealthInsuranceObj.health_insurance_plan = health_insurance_plan_id;

    /*
    when changing from non existing Hi to existing Hi,
    Deleting the health_insurance and health_insurance_plan
  */

    if (
      patientHealthInsurance?.health_insurance &&
      !patientHealthInsurance?.health_insurance?.is_system_added
    ) {
      await HealthInsurancePlanMaster.deleteOne({
        _id: patientHealthInsurance.health_insurance_plan
          .health_insurance_plan_master_id,
        is_system_added: false,
        created_by: user_id,
      });

      await HealthInsuranceMaster.deleteOne({
        _id: patientHealthInsurance.health_insurance.health_insurance_master_id,
        is_system_added: false,
        created_by: user_id,
      });

      return PatientHealthInsurance.updateOne(
        { user: user_id },
        patientHealthInsuranceObj,
        { new: true, upsert: true },
      );
    }
  }

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
    console.error(error);
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
    console.error(error);
    throw error;
  }
};
const getMasterReactionDetails = async name => {
  try {
    const regexValue = new RegExp(name, 'i');
    const query = { name: { $regex: regexValue } };

    const reactionList = await AllergiesMaster.findOne(query).select(
      '-created_by -updated_by -created_on -updated_on -__v',
    );

    return reactionList?.reactions?.map(ele => ({
      reaction_master_id: ele?._id,
      name: ele?.name,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getPatientDetailsByEmail = async ({ email }) => {
  try {
    return User.findOne({ email, role: 'patient' }).select(
      '-created_on -updated_on -__v',
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addFamilyAccountDetails = async ({
  firstName,
  lastName,
  email,
  isNewAccount,
  phoneNumber,
  senderUserId,
  profileImage,
  relation,
  dob,
}) => {
  try {
    const senderDetails = await User.findOne({ _id: senderUserId }).select(
      'first_name',
    );

    const checkRelation = await FamilyRealtionshipMaster.findOne({ relation });
    if (!checkRelation) {
      throw new Error(giveCorrectRelationShip);
    }
    const checkUserData = await User.findOne({ email });
    if (isNewAccount === newAccountTrue && checkUserData) {
      throw new Error(errorConstants.emailAlreadyExists);
    }
    if (isNewAccount === newAccountfalse && !checkUserData) {
      throw new Error(errorConstants.emailWasNotFound);
    }
    if (
      (checkUserData && checkUserData.first_name !== firstName) ||
      (checkUserData && checkUserData.last_name !== lastName)
    ) {
      throw new Error(errorConstants.givenNameNotMatched);
    }
    const checkAccountAlreadyAdded = await LinkedAccounts.findOne({
      patient: senderUserId,
      linked_accounts: {
        $elemMatch: {
          linked_user_account: checkUserData?._id,
        },
      },
    });
    if (checkAccountAlreadyAdded) {
      throw new Error(errorConstants.accountAlreadyLinked);
    }
    const checkUser =
      isNewAccount === newAccountTrue && !checkUserData
        ? await User.create({
            first_name: firstName,
            last_name: lastName,
            dob,
            email: email?.toLowerCase(),
            phone_number: phoneNumber,
            role: roleConstant.patient,
            account_created_by: senderUserId,
          })
        : await User.findOne({ email }).select(
            '-email_verification_token -preference -created_on -updated_on -__v -is_system_added -tenant -password -patient_detail',
          );

    if (!checkUserData) {
      const defaultObj = {
        patient: checkUser.user_id,
        created_by: checkUser.user_id,
        updated_by: checkUser.user_id,
      };

      const patientObj = await Patient.create(defaultObj);

      const preferenceObj = await Preference.create(defaultObj);

      checkUser.patient_detail = patientObj.patient_id;
      checkUser.preference = preferenceObj.preference_id;

      await checkUser.save();
    }

    const accountDetails = {
      id: checkUser?._id,
      firstName: checkUser?.first_name,
      lastName: checkUser?.last_name,
      email: checkUser?.email,
      memberRole: roleConstant.member,
      relationShip: checkRelation?.name,
      profileImg: checkUser?.picture_url
        ? await getSignedUrl(checkUser?.picture_url)
        : await getSignedUrl(defaultProfileImg),
      dob: checkUser?.dob,
      phoneNumber: checkUser?.phone_number,
    };

    const checkExistsAccessDetails = await AccessSettings.findOne({
      $and: [
        {
          user: checkUser?._id,
        },
        {
          to_share_user: senderDetails?._id,
        },
      ],
    });
    if (!checkExistsAccessDetails) {
      await AccessSettings.create({
        user: checkUser?._id,
        to_share_user: senderDetails?._id,
      });
    }

    const linkedAccounts = await LinkedAccounts.findOne({
      patient: senderUserId,
    });

    if (profileImage && typeof profileImage === 'object') {
      let key = '';
      const { buff, format } =
        getBufferAndFormatFromMulterFileType(profileImage);
      key = `${s3_profile_img}/${checkUser._id}`;
      await saveInS3Bucket(format, buff, key);
      await User.updateOne(
        { _id: checkUser._id },
        {
          picture_url: key,
        },
      );
    }
    if (!linkedAccounts) {
      await LinkedAccounts.create({
        patient: senderUserId,
        linked_accounts: [
          {
            linked_user_account: checkUser?._id,
            relation,
            is_accepted: false,
            acconut_type:
              isNewAccount === newAccountfalse ? accountJoined : accountCreated,
          },
        ],
      });
    } else {
      linkedAccounts?.linked_accounts?.push({
        linked_user_account: checkUser?._id,
        relation,
        is_accepted: false,
        acconut_type:
          isNewAccount === newAccountfalse ? accountJoined : accountCreated,
      });

      await linkedAccounts.save();
    }

    const familyRelationDetails = await FamilyRealtionshipMaster.findOne({
      _id: relation,
    });

    if (familyRelationDetails?.is_below_18) {
      await User.updateOne(
        { _id: checkUser?._id },
        {
          email_verified: true,
        },
      );
      await LinkedAccounts.updateOne(
        {
          'linked_accounts.linked_user_account': checkUser?._id,
        },
        {
          $set: {
            'linked_accounts.$.is_accepted': true,
            'linked_accounts.$.accepted_date': new Date(),
          },
        },
      );
    }
    if (!familyRelationDetails?.is_below_18) {
      const token = createToken(
        {
          user_id: senderUserId,
          patient_detail: checkUser?._id,
          email: email.toLowerCase(),
        },
        ACCEPT_LINK_REQUEST,
      );

      const acceptLink = `${process.env.API_URL}/patient/${process.env.API_VERSION}/account/accept_request?token=${token}`;

      await sendTemplatedEmail({
        to: email,
        data: {
          link: acceptLink,
          year: moment().format('YYYY'),
          isNewUser: isNewAccount,
          isOwner: false,
          sender: senderDetails?.first_name,
          receiver: firstName || checkUser?.first_name,
        },
        Template: ACCEPT_LINK_REQUEST,
      });
      await User.updateOne(
        { _id: checkUser?._id },
        {
          is_linked_permission_sent: true,
        },
      );
    }

    return accountDetails;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getFamilyAccountDetails = async ({ patient, isOrganizationAdmin }) => {
  try {
    let query;
    if (isOrganizationAdmin) {
      query = { patient: isOrganizationAdmin };
    } else {
      query = {
        $or: [{ patient }, { 'linked_accounts.linked_user_account': patient }],
      };
    }
    const result = await LinkedAccounts.findOne(query)
      .populate([
        {
          path: 'patient',
          model: 'User',
          select:
            'first_name last_name email role _id picture_url dob phone_number',
        },
        {
          path: 'linked_accounts.linked_user_account',
          model: 'User',
          select:
            'first_name last_name email role _id picture_url dob account_created_by phone_number',
        },
        {
          path: 'linked_accounts.relation',
          model: 'FamilyRealtionshipMaster',
          select: 'name _id is_below_18',
        },
      ])
      .select('-created_on -updated_on -__v -created_by -updated_by')
      .lean();
    const addedAccounts = [];
    let primaryAccount = {};
    const checkOtherAccessAccount = await LinkedAccounts.find({
      linked_accounts: {
        $elemMatch: {
          linked_user_account: patient,
          acconut_type: accountShared,
        },
      },
    }).populate([
      {
        path: 'patient',
        model: 'User',
        select:
          'first_name last_name email role _id picture_url dob phone_number',
      },
    ]);
    if (checkOtherAccessAccount) {
      const accessAccounts = await Promise.all(
        checkOtherAccessAccount.map(async elem => ({
          id: elem?.patient?._id,
          firstName: elem?.patient?.first_name,
          lastName: elem?.patient?.last_name,
          email: elem?.patient?.email,
          memberRole: sharedAccount,
          profileImg: elem?.patient?.picture_url
            ? await getSignedUrl(elem?.patient?.picture_url)
            : await getSignedUrl(defaultProfileImg),
          dob: elem?.patient?.dob,
          phoneNumber: elem?.patient?.phone_number,
        })),
      );
      if (!isOrganizationAdmin) {
        addedAccounts.push(...accessAccounts);
      }
    }
    if (!result) {
      const userDetails = await User.findOne({ _id: patient })
        .select('first_name last_name email _id picture_url dob phone_number')
        .lean();
      primaryAccount = {
        id: userDetails?._id,
        firstName: userDetails?.first_name,
        lastName: userDetails?.last_name,
        email: userDetails?.email,
        memberRole: roleConstant.accountOwner,
        profileImg: userDetails?.picture_url
          ? await getSignedUrl(userDetails?.picture_url)
          : await getSignedUrl(defaultProfileImg),
        phoneNumber: userDetails?.phone_number,
      };
      return [primaryAccount];
    }

    const organizationAdmin = result?.patient;

    if (JSON.parse(JSON.stringify(organizationAdmin?._id)) === patient) {
      primaryAccount = {
        id: organizationAdmin._id,
        firstName: organizationAdmin?.first_name,
        lastName: organizationAdmin?.last_name,
        email: organizationAdmin?.email,
        memberRole: isOrganizationAdmin
          ? roleConstant.accountOwner
          : JSON.parse(JSON.stringify(organizationAdmin?._id)) === patient
          ? roleConstant.accountOwner
          : roleConstant.memberOrganiser,
        profileImg: organizationAdmin?.picture_url
          ? await getSignedUrl(organizationAdmin?.picture_url)
          : await getSignedUrl(defaultProfileImg),
        phoneNumber: organizationAdmin?.phone_number,
      };
    }

    await Promise.all(
      JSON.parse(JSON.stringify(result?.linked_accounts)).map(async ele => {
        if (ele?.linked_user_account?._id === patient) {
          primaryAccount = {
            id: ele?.linked_user_account?._id,
            firstName: ele?.linked_user_account?.first_name,
            lastName: ele?.linked_user_account?.last_name,
            email: ele?.linked_user_account?.email,
            memberRole: !isOrganizationAdmin
              ? roleConstant.accountOwner
              : roleConstant.member,
            profileImg: ele?.linked_user_account?.picture_url
              ? await getSignedUrl(ele?.linked_user_account?.picture_url)
              : await getSignedUrl(defaultProfileImg),
            dob: ele?.linked_user_account?.dob,
            phoneNumber: ele?.linked_user_account?.phone_number,
          };
          if (isOrganizationAdmin) {
            primaryAccount.isAccepted = ele?.is_accepted;
            primaryAccount.isUserCreatedByAdmin =
              !!ele?.linked_user_account?.account_created_by;
          }

          if (ele?.is_accepted || ele?.is_admin_accept_request) {
            addedAccounts.push({
              id: organizationAdmin._id,
              firstName: organizationAdmin?.first_name,
              lastName: organizationAdmin?.last_name,
              email: organizationAdmin?.email,
              memberRole: isOrganizationAdmin
                ? roleConstant.accountOwner
                : roleConstant.memberOrganiser,
              profileImg: organizationAdmin?.picture_url
                ? await getSignedUrl(organizationAdmin?.picture_url)
                : await getSignedUrl(defaultProfileImg),
              phoneNumber: organizationAdmin?.phone_number,
              status:
                ele?.acconut_type === accountShared ? sharedAccount : null,
            });
          }
        }
        if (
          (ele?.linked_user_account?._id !== patient && isOrganizationAdmin) ||
          JSON.parse(JSON.stringify(organizationAdmin?._id)) === patient
        ) {
          addedAccounts.push({
            id: ele?.linked_user_account?._id,
            firstName: ele?.linked_user_account?.first_name,
            lastName: ele?.linked_user_account?.last_name,
            email: ele?.linked_user_account?.email,
            memberRole: roleConstant.member,
            relationShip: ele?.relation?.name,
            profileImg: ele?.linked_user_account?.picture_url
              ? await getSignedUrl(ele?.linked_user_account?.picture_url)
              : await getSignedUrl(defaultProfileImg),
            isAccepted: ele?.relation?.is_below_18 ? true : ele?.is_accepted,
            isUserCreatedByAdmin:
              !!ele?.linked_user_account?.account_created_by,
            dob: ele?.linked_user_account?.dob,
            phoneNumber: ele?.linked_user_account?.phone_number,
            status: ele?.acconut_type === accountShared ? sharedAccount : null,
          });
        }
      }),
    );

    return [primaryAccount, ...addedAccounts];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const updateFamilyAccountDetails = async ({
  patientObj,
  profileImage,
  userId,
}) => {
  const user = await User.findOne({ _id: userId }).lean();
  if (!user) {
    throw new Error(errorConstants.patientIdNotFound);
  }
  await User.updateOne(
    { _id: user._id },
    {
      first_name: patientObj.first_name || user.first_name,
      last_name: patientObj.last_name || user.last_name,
      email: patientObj.email || user.email,
      phone_number: patientObj.phone_number || user.phone_number,
      dob: patientObj.dob || user.dob,
    },
  );
  if (profileImage && typeof profileImage === 'object') {
    let key = '';
    const { buff, format } = getBufferAndFormatFromMulterFileType(profileImage);
    key = `${s3_profile_img}/${user._id}`;
    await saveInS3Bucket(format, buff, key);
    await User.updateOne(
      { _id: user._id },
      {
        picture_url: key,
      },
    );
  }
  if (patientObj.relation) {
    await LinkedAccounts.updateOne(
      {
        'linked_accounts.linked_user_account': userId._id,
      },
      {
        $push: { 'linked_accounts.relation': patientObj.relation },
      },
    );
  }
  return user;
};
const deleteFamilyAccountsDetails = async ({ adminId, patient }) => {
  try {
    const userDetails = await User.findById(patient);
    const checkAccountHasLinked = await LinkedAccounts.findOne({
      patient: adminId,
      linked_accounts: {
        $elemMatch: {
          linked_user_account: patient,
        },
      },
    });
    const checkAccessAccount = await LinkedAccounts.findOne({
      patient,
      linked_accounts: {
        $elemMatch: {
          linked_user_account: adminId,
        },
      },
    });
    if (checkAccessAccount) {
      await LinkedAccounts.updateOne(
        { patient },
        { $pull: { linked_accounts: { linked_user_account: adminId } } },
      ).then(async () => {
        await AccessSettings.deleteOne({
          user: patient,
        });
      });
      return accountRemoved;
    }
    if (!checkAccountHasLinked) {
      throw new Error(errorConstants.accountHasNotLinked);
    }

    if (userDetails?.account_created_by) {
      await User.deleteOne({
        _id: patient,
      }).then(async () => {
        await LinkedAccounts.updateOne(
          { patient: adminId },
          { $pull: { linked_accounts: { linked_user_account: patient } } },
        );
        await AccessSettings.deleteOne({
          user: patient,
        });
      });
      return accountDeleted;
    }
    await LinkedAccounts.updateOne(
      { patient: adminId },
      { $pull: { linked_accounts: { linked_user_account: patient } } },
    ).then(async () => {
      await AccessSettings.deleteOne({
        user: patient,
      });
    });
    return accountRemoved;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const swithLoginAccount = async ({ switcherAccountId, adminAccountId }) => {
  try {
    const switchAccountDetails = await User.findOne({
      _id: switcherAccountId,
    }).lean();
    const adminAccountDetails = await User.findOne({
      _id: adminAccountId,
    }).lean();
    if (!switchAccountDetails || !adminAccountDetails) {
      throw new Error(someEmailMissing);
    }
    if (switcherAccountId !== adminAccountId) {
      const checkValidAccount = await LinkedAccounts.findOne({
        patient: adminAccountDetails._id,
        linked_accounts: {
          $elemMatch: {
            linked_user_account: switchAccountDetails._id,
            $or: [{ is_accepted: true }, { is_admin_accept_request: true }],
          },
        },
      });
      if (!checkValidAccount) {
        throw new Error(someEmailMissing);
      }
    }
    const tokenForSwitchAccount = await switchAccountAccessToken({
      switcherAccountId: switchAccountDetails._id,
      role: roleConstant.patientRoleCheck,
      adminAccountId:
        switcherAccountId === adminAccountId ? null : adminAccountDetails._id,
    });
    return tokenForSwitchAccount;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateAccessSettings = async ({ accountId, userId, reqBody }) => {
  try {
    return AccessSettings.updateOne(
      { user: userId, to_share_user: accountId },
      { ...reqBody, updated_by: accountId },
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getOrganizerAdmin = async id => {
  try {
    const isAdmin = LinkedAccounts.findOne({ patient: id });
    return !!isAdmin;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sentAccountInvitation = async () => {
  try {
    const below18Accounts = await User.find({
      is_linked_permission_sent: false,
    }).populate([
      {
        path: 'account_created_by',
        model: 'User',
        select: 'first_name last_name email role _id picture_url dob',
      },
    ]);

    for (const user of below18Accounts) {
      if (
        isBirthdayComingUpAndAbove18(user.dob) &&
        !user?.is_linked_permission_sent
      ) {
        const token = createToken(
          {
            user_id: below18Accounts?.account_created_by?._id,
            patient_detail: user._id,
            email: user.email.toLowerCase(),
          },
          ACCEPT_LINK_REQUEST,
        );

        const acceptLink = `${process.env.API_URL}/patient/${process.env.API_VERSION}/account/accept_request?token=${token}`;

        await sendTemplatedEmail({
          to: user.email,
          data: {
            link: acceptLink,
            year: moment().format('YYYY'),
            isNewUser: true,
            isOwner: false,
            sender: below18Accounts?.account_created_by?.first_name,
            receiver: user.first_name,
          },
          Template: ACCEPT_LINK_REQUEST,
        });
        await User.updateOne(
          { _id: user._id },
          {
            is_linked_permission_sent: true,
          },
        );
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getFamilyAccountHistory = async ({ accountId }) => {
  try {
    const adminAccountDetails = await LinkedAccounts.findOne({
      patient: accountId,
    });
    const familyAccountHistory = [];
    if (adminAccountDetails) {
      const result = await LinkedAccounts.findOne({ patient: accountId })
        .populate([
          {
            path: 'patient',
            model: 'User',
            select:
              'first_name last_name email role _id picture_url dob phone_number',
          },
          {
            path: 'linked_accounts.linked_user_account',
            model: 'User',
            select:
              'first_name last_name email role _id picture_url dob account_created_by phone_number acconut_type',
          },
          {
            path: 'linked_accounts.relation',
            model: 'FamilyRealtionshipMaster',
            select: 'name _id',
          },
        ])
        .select('-created_on -updated_on -__v -created_by -updated_by')
        .lean();

      await Promise.all(
        JSON.parse(JSON.stringify(result?.linked_accounts)).map(async ele => {
          if (ele?.is_accepted || ele?.is_admin_accept_request) {
            familyAccountHistory.push({
              id: ele?.linked_user_account?._id,
              firstName: ele?.linked_user_account?.first_name,
              lastName: ele?.linked_user_account?.last_name,
              email: ele?.linked_user_account?.email,
              profileImg: ele?.linked_user_account?.picture_url
                ? await getSignedUrl(ele?.linked_user_account?.picture_url)
                : await getSignedUrl(defaultProfileImg),
              acceptedDate: ele?.is_accepted
                ? ele?.accepted_date
                : ele?.admin_accepted_date,
              relation: ele?.relation?.name,
              status: ele?.acconut_type,
            });
          }
        }),
      );
    }
    if (!adminAccountDetails) {
      const result = await LinkedAccounts.findOne({
        'linked_accounts.linked_user_account': accountId,
      })
        .populate([
          {
            path: 'patient',
            model: 'User',
            select:
              'first_name last_name email role _id picture_url dob phone_number',
          },
          {
            path: 'linked_accounts.linked_user_account',
            model: 'User',
            select:
              'first_name last_name email role _id picture_url dob account_created_by phone_number _id',
          },
        ])
        .select('-created_on -updated_on -__v -created_by -updated_by')
        .lean();

      if (result) {
        const organizerDetails = result?.patient;
        await Promise.all(
          JSON.parse(JSON.stringify(result?.linked_accounts)).map(async ele => {
            if (
              (ele?.linked_user_account?._id === accountId &&
                ele?.is_accepted) ||
              ele?.is_admin_accept_request
            ) {
              familyAccountHistory.push({
                id: organizerDetails?._id,
                firstName: organizerDetails?.first_name,
                lastName: organizerDetails?.last_name,
                profileImg: organizerDetails?.picture_url
                  ? await getSignedUrl(organizerDetails?.picture_url)
                  : await getSignedUrl(defaultProfileImg),
                acceptedDate: ele?.is_accepted
                  ? ele?.accepted_date
                  : ele?.admin_accepted_date,
                status: accountJoined,
                info: sharingAccessAccount,
              });
            }
          }),
        );
      }
    }
    return familyAccountHistory;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const memberSharingAccount = async ({
  email,
  firstName,
  lastName,
  senderUser,
}) => {
  try {
    const organizerAccountDetails = await User.findOne({ email }).lean();

    if (!organizerAccountDetails) {
      throw new Error(errorConstants.correctEmailRequired);
    }
    if (
      organizerAccountDetails.first_name !== firstName ||
      organizerAccountDetails.last_name !== lastName
    ) {
      throw new Error(errorConstants.givenNameNotMatched);
    }
    const requestedAccountDetails = await User.findOne({
      _id: senderUser,
    }).lean();
    const checkExistsAccess = await AccessSettings.findOne({
      user: requestedAccountDetails?._id,
    });
    const checkAlreadyLinked = await LinkedAccounts.findOne({
      $and: [
        {
          patient: organizerAccountDetails._id,
        },
        {
          'linked_accounts.linked_user_account': requestedAccountDetails?._id,
        },
      ],
    });

    if (checkAlreadyLinked) {
      throw new Error(errorConstants.accountLinkedSameOrganization);
    }
    if (organizerAccountDetails._id === requestedAccountDetails._id) {
      throw new Error(errorConstants.sameAccount);
    }
    if (!checkExistsAccess) {
      await AccessSettings.create({
        user: requestedAccountDetails?._id,
        to_share_user: organizerAccountDetails._id,
      });
    }

    const linkedAccounts = await LinkedAccounts.findOne({
      patient: organizerAccountDetails._id,
    });
    if (!linkedAccounts) {
      await LinkedAccounts.create({
        patient: organizerAccountDetails._id,
        linked_accounts: [
          {
            linked_user_account: requestedAccountDetails?._id,
            is_accepted: false,
            acconut_type: accountShared,
            is_admin_accept_request: false,
          },
        ],
      });
    } else {
      linkedAccounts?.linked_accounts?.push({
        linked_user_account: requestedAccountDetails?._id,
        is_accepted: false,
        acconut_type: accountShared,
        is_admin_accept_request: false,
      });

      await linkedAccounts.save();
    }
    const token = createToken(
      {
        user_id: requestedAccountDetails._id,
        patient_detail: organizerAccountDetails?._id,
        email: email.toLowerCase(),
      },
      MEMBER_SHARING_ACCOUNT,
    );

    const acceptLink = `${process.env.API_URL}/patient/${process.env.API_VERSION}/account/accept_sharing_request?token=${token}`;

    await sendTemplatedEmail({
      to: email,
      data: {
        link: acceptLink,
        year: moment().format('YYYY'),
        sender: requestedAccountDetails?.first_name,
        receiver: organizerAccountDetails?.first_name,
      },
      Template: MEMBER_SHARING_ACCOUNT,
    });
    return {
      id: organizerAccountDetails?._id,
      firstName: organizerAccountDetails?.first_name,
      lastName: organizerAccountDetails?.last_name,
      email: organizerAccountDetails?.email,
      profileImg: organizerAccountDetails?.picture_url
        ? await getSignedUrl(organizerAccountDetails?.picture_url)
        : await getSignedUrl(defaultProfileImg),
      dob: organizerAccountDetails?.dob,
      phoneNumber: organizerAccountDetails?.phone_number,
      memberRole: sharedAccount,
      relationship: '',
      isAccepted: false,
      isUserCreatedByAdmin: false,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const removeSharingAccount = async ({ adminAccountId, removeAccountId }) => {
  try {
    const checkAlreadyRemoved = await LinkedAccounts.findOne({
      patient: adminAccountId,
      linked_accounts: {
        $elemMatch: {
          linked_user_account: removeAccountId,
        },
      },
    });
    if (!checkAlreadyRemoved) {
      throw new Error(errorConstants.accountAccessAlreadyRemoved);
    }
    return LinkedAccounts.updateOne(
      { _id: adminAccountId },
      { $pull: { linked_accounts: { linked_user_account: removeAccountId } } },
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
  addFamilyAccountDetails,
  getFamilyAccountDetails,
  deleteFamilyAccountsDetails,
  swithLoginAccount,
  getAccessSettingsById,
  updateAccessSettings,
  getOrganizerAdmin,
  sentAccountInvitation,
  getFamilyAccountHistory,
  memberSharingAccount,
  removeSharingAccount,
  updateFamilyAccountDetails,
};
