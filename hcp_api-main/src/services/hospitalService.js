/* eslint-disable indent */
/* eslint-disable no-useless-catch */
const roleConstant = require('../appConstants/roleConstant');
const { adminRoleCheck } = require('../appConstants/roleConstant');
const { s3_tenant } = require('../config/AWS');
const {
  Tenant,
  User,
  TenantGroupMapper,
  InviteResearchSites,
} = require('../models');
const { calculateAge } = require('../utils/commonFunctions');
const { tablePagination } = require('../utils/paginationUtils');
const {
  saveInS3Bucket,
  getBufferAndFormatFromMulterFileType,
  getSignedUrl,
} = require('./s3Service');

const formatHospitalProfile = async res => {
  const therapeuticAreasNames = (res?.therapeutic_areas || []).map(
    area => area.name,
  );
  const formattedList = {
    address: `${res?.address_line1 || ''}`,
    city: res?.city || '',
    country: res?.country || '',
    postalCode: res?.post_code || '',
    therapeuticAreas: therapeuticAreasNames.join(','),
    products: res?.products,
    name: res?.name || '',
    image: res?.image ? await getSignedUrl(res?.image) : '',
  };
  return formattedList;
};

const formatHospitalGroupProfile = async res => {
  const formattedList = {
    hospitalGroupName: res?.hospital_group_name || '',
    image: res?.image ? await getSignedUrl(res?.image) : '',
    hospitals: await Promise.all(
      res.hospitals.map(async val => ({
        _id: val._id,
        therapeutic_areas: (val?.therapeutic_areas || []).map(
          area => area.name,
        ),
        address: `${val?.address_line1 || ''}`,
        city: val?.city || '',
        country: val?.country || '',
        postalCode: val?.post_code || '',
        products: val?.products,
        name: val?.name || '',
        image: val?.image ? await getSignedUrl(val?.image) : '',
      })),
    ),
  };
  return formattedList;
};

const getAllHospital = async (page, perPage) => {
  try {
    const { skip, limit } = tablePagination(page, perPage);

    const hospitalList = await Tenant.find()
      .populate([
        {
          path: 'therapeutic_areas',
          model: 'TherapeuticAreas',
          select: '-created_on -updated_on -__v',
        },
        {
          path: 'hospital_group',
          model: 'TenantGroupMapper',
          select: '-created_on -updated_on -__v',
        },
      ])
      .skip(skip)
      .limit(limit);

    const totalCount = await Tenant.countDocuments();

    return [hospitalList, totalCount];
  } catch (error) {
    throw error;
  }
};

const getSingleHospitalProfileById = async hospitalId => {
  try {
    const result = await Tenant.find({
      _id: hospitalId,
    }).populate([
      {
        path: 'therapeutic_areas',
        model: 'TherapeuticAreas',
        select: '-created_on -updated_on -__v',
      },
    ]);
    const formattedList = await formatHospitalProfile(result[0]);
    return formattedList;
  } catch (error) {
    throw error;
  }
};

const updateHospitalProfileById = async ({ id, hospitalProfileObj, logo }) => {
  try {
    let key = '';
    if (typeof logo === 'object') {
      const { buff, format } = getBufferAndFormatFromMulterFileType(logo);
      key = `${s3_tenant}/${id}`;
      await saveInS3Bucket(format, buff, key);
    }

    return Tenant.updateOne(
      {
        _id: id,
      },
      {
        therapeutic_areas: JSON.parse(hospitalProfileObj.therapeuticAreas),
        products: JSON.parse(hospitalProfileObj.products),
        address_line1: hospitalProfileObj.address,
        post_code: hospitalProfileObj.postalCode,
        country: hospitalProfileObj.country,
        city: hospitalProfileObj.city,
        image: logo && key,
      },
    );
  } catch (error) {
    throw error;
  }
};

const getUsersByHospitalId = async hospitalId => {
  try {
    return User.find({
      tenant: hospitalId,
      role: { $in: adminRoleCheck },
    }).select('-password -email_verification_token -updated_on -__v');
  } catch (error) {
    throw error;
  }
};

const addUsersByHospitalId = async (hospitalId, userObj) => {
  try {
    const exists = await User.findOne({
      email: userObj.email,
    });
    if (exists) {
      throw new Error('Email already exists');
    }

    const newUser = await User.create({
      tenant: hospitalId,
      ...userObj,
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

const updateUserRole = async (userId, newRole) => {
  try {
    return User.updateOne({ _id: userId }, { role: newRole });
  } catch (error) {
    throw error;
  }
};

const deleteAdminUser = async userId => {
  try {
    return User.deleteOne({ _id: userId });
  } catch (error) {
    throw error;
  }
};

const searchHospital = async query => {
  try {
    const regexValue = new RegExp(query, 'i');
    const hospitals = await Tenant.find({
      name: { $regex: regexValue },
      type_of_organization: roleConstant.singleHospital,
    }).select('_id name');

    return hospitals;
  } catch (error) {
    console.error('Error in search hospital:', error.message);
    throw error;
  }
};

const getGroupUsersByHospitalId = async hospitalGroupId => {
  try {
    return User.find({
      tenant_group: hospitalGroupId,
      role: { $in: adminRoleCheck },
    }).select('-password -email_verification_token -updated_on -__v');
  } catch (error) {
    throw error;
  }
};

const addGroupUsersByHospitalGroupId = async (hospitalGroupId, userObj) => {
  try {
    const exists = await User.findOne({
      email: userObj.email,
    });
    if (exists) {
      throw new Error('Email already exists');
    }

    const newUser = await User.create({
      tenant_group: hospitalGroupId,
      email_verified: false,
      role: roleConstant.hospitalGroupAdmin,
      ...userObj,
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

const getHospitalGroupProfileById = async hospitalGroupId => {
  try {
    const result = await TenantGroupMapper.find({
      _id: hospitalGroupId,
    }).populate([
      {
        path: 'hospitals',
        model: 'Tenant',
        select: '-created_on -updated_on -__v',
        populate: {
          path: 'therapeutic_areas',
          model: 'TherapeuticAreas',
          select: '-created_on -updated_on -__v',
        },
      },
    ]);
    const formattedList = await formatHospitalGroupProfile(result[0]);
    return formattedList;
  } catch (error) {
    throw error;
  }
};

const updateHospitalGroupProfileById = async ({
  id,
  hospitalGroupProfileObj,
  logo,
}) => {
  try {
    let key = '';
    if (typeof logo === 'object') {
      const { buff, format } = getBufferAndFormatFromMulterFileType(logo);
      key = `${s3_tenant}/${id}`;
      await saveInS3Bucket(format, buff, key);
    }

    const selectedHospitalIds = JSON.parse(
      hospitalGroupProfileObj.hospitals,
    ).map(hospital => hospital._id);
    const hospitalGroup = await TenantGroupMapper.find({
      _id: id,
    });

    await Tenant.updateMany(
      {
        _id: { $in: hospitalGroup[0].hospitals },
      },
      {
        $set: {
          type_of_organization: roleConstant.singleHospital,
          hospital_group: null,
        },
      },
    );

    await Tenant.updateMany(
      {
        _id: { $in: selectedHospitalIds },
      },
      {
        $set: {
          type_of_organization: roleConstant.hospitalGroup,
          hospital_group: id,
        },
      },
    );

    return TenantGroupMapper.updateOne(
      { _id: id },
      {
        $set: {
          hospital_group_name: hospitalGroupProfileObj.hospitalGroupName,
          hospitals: selectedHospitalIds,
        },
      },
    );
  } catch (error) {
    throw error;
  }
};

const getClinicalResearchListByHospitalId = async (id, page, perPage) => {
  try {
    const { skip, limit } = tablePagination(page, perPage);

    const trialList = await InviteResearchSites.find({
      site: id,
    })
      .populate([
        {
          path: 'trial_participated_by',
          model: 'User',
          select: '-created_on -updated_on -__v',
        },
      ])
      .skip(skip)
      .limit(limit);

    const totalCount = await InviteResearchSites.find({
      site: id,
    }).countDocuments();

    return [trialList, totalCount];
  } catch (error) {
    throw error;
  }
};

const getPatientInsightsByCategory = async id => {
  try {
    const result = await User.find({
      tenant: id,
      role: roleConstant.patient,
    }).populate([
      {
        path: 'therapeutic_areas',
        model: 'TherapeuticAreas',
        select: '-created_on -updated_on -__v',
      },
    ]);

    const ageCategories = { '<18': 0, '18-65': 0, '>65': 0 };
    const genderCategories = { Male: 0, Female: 0 };
    const therapeuticAreasCategories = {};

    result.forEach(async patient => {
      const age = await calculateAge(patient?.dob);
      if (age < 18) {
        ageCategories['<18'] += 1;
      } else if (age >= 18 && age <= 65) {
        ageCategories['18-65'] += 1;
      } else {
        ageCategories['>65'] += 1;
      }

      if (patient.gender === 'male') {
        genderCategories.Male += 1;
      } else {
        genderCategories.Female += 1;
      }

      const therapeuticAreas = patient.therapeutic_areas;
      if (therapeuticAreas && therapeuticAreas.length > 0) {
        therapeuticAreas.forEach(area => {
          const { name } = area;
          therapeuticAreasCategories[name] =
            (therapeuticAreasCategories[name] || 0) + 1;
        });
      }
    });

    return { ageCategories, genderCategories, therapeuticAreasCategories };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllHospital,
  getSingleHospitalProfileById,
  updateHospitalProfileById,
  getUsersByHospitalId,
  addUsersByHospitalId,
  updateUserRole,
  deleteAdminUser,
  searchHospital,
  getGroupUsersByHospitalId,
  addGroupUsersByHospitalGroupId,
  getHospitalGroupProfileById,
  updateHospitalGroupProfileById,
  getClinicalResearchListByHospitalId,
  getPatientInsightsByCategory,
};
