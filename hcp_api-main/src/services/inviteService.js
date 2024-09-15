/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-catch */
const {
  verifyEmailSubject,
  setupPassword,
} = require('../appConstants/displayConstant');
const predefinedDataConstants = require('../appConstants/predefinedDataConstants');
const roleConstant = require('../appConstants/roleConstant');
const { s3_tenant } = require('../config/AWS');
const {
  TherapeuticAreas,
  Tenant,
  User,
  TenantGroupMapper,
} = require('../models');
const { checkEmailExists } = require('./accountService');
const { sendEmail } = require('./emailService');
const {
  getBufferAndFormatFromMulterFileType,
  saveInS3Bucket,
} = require('./s3Service');

const getAllTherapeuticAreas = async () => {
  try {
    const result = await TherapeuticAreas.find().select('_id name');
    return result.map(item => ({ id: item._id, value: item.name }));
  } catch (error) {
    throw error;
  }
};

const createNewHospital = async (hospitalObj, logo) => {
  try {
    const exist = await checkEmailExists(hospitalObj.adminEmail);
    if (exist) {
      throw new Error('Email already exists.');
    }

    const hospitalResult = await Tenant.create({
      type_of_organization: hospitalObj.selectedType,
      therapeutic_areas: JSON.parse(hospitalObj.therapeuticAreas),
      products: JSON.parse(hospitalObj.products),
      name: hospitalObj.name,
      unique_name: hospitalObj.name,
      access_type: predefinedDataConstants.access_type_tenant.share,
    });

    let key = '';
    if (typeof logo === 'object') {
      const { buff, format } = getBufferAndFormatFromMulterFileType(logo);
      key = `${s3_tenant}/${hospitalResult._id}`;
      await saveInS3Bucket(format, buff, key);
    }

    await User.create({
      first_name: hospitalObj.firstName,
      last_name: hospitalObj.lastName,
      email: hospitalObj.adminEmail,
      email_verified: false,
      role: roleConstant.hospitalAdmin,
      tenant: hospitalResult._id,
    });

    const to = hospitalObj.adminEmail;
    const subject = verifyEmailSubject;
    const body = `${process.env.ADMIN_PORTAL}/${setupPassword}`;
    await sendEmail({ to, subject, body });

    hospitalResult.image = key;
    await hospitalResult.save();

    return hospitalResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createNewHospitalGroup = async (hospitalGroupObj, logo) => {
  try {
    const exist = await checkEmailExists(hospitalGroupObj.groupAdminEmail);
    if (exist) {
      throw new Error('Email already exists.');
    }

    const hospitalsArray = JSON.parse(hospitalGroupObj.hospitals);
    const hospitalsWithId = [];
    const hospitalsWithoutId = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const hospital of hospitalsArray) {
      if (hospital._id !== null) {
        hospitalsWithId.push(hospital._id);
      } else {
        hospitalsWithoutId.push(hospital.name);
      }
    }

    if (hospitalsWithoutId.length > 0) {
      const newTenantIds = await Promise.all(
        hospitalsWithoutId.map(async hospitalName => {
          const newTenant = await Tenant.create({
            name: hospitalName,
            type_of_organization: roleConstant.hospitalGroup,
            therapeutic_areas: [],
            products: predefinedDataConstants.hospitalProducts,
            unique_name: hospitalName,
            access_type: predefinedDataConstants.access_type_tenant.share,
          });
          return newTenant._id.toString();
        }),
      );

      hospitalsWithId.push(...newTenantIds);
    }

    let hospitalGroupResult;

    if (hospitalsWithId.length > 0) {
      hospitalGroupResult = await TenantGroupMapper.create({
        hospital_group_name: hospitalGroupObj.hospitalGroupName,
        hospitals: hospitalsWithId,
      });
      await Tenant.updateMany(
        {
          _id: { $in: hospitalsWithId },
        },
        {
          $set: {
            type_of_organization: roleConstant.hospitalGroup,
            hospital_group: hospitalGroupResult._id,
          },
        },
      );
    }
    let key = '';
    if (typeof logo === 'object') {
      const { buff, format } = getBufferAndFormatFromMulterFileType(logo);
      key = `${s3_tenant}/${hospitalGroupResult._id}`;
      await saveInS3Bucket(format, buff, key);
    }

    await User.create({
      first_name: hospitalGroupObj.groupAdminFirstName,
      last_name: hospitalGroupObj.groupAdminLastName,
      email: hospitalGroupObj.groupAdminEmail,
      email_verified: false,
      role: roleConstant.hospitalGroupAdmin,
      tenant_group: hospitalGroupResult._id,
    });

    const to = hospitalGroupObj.groupAdminEmail;
    const subject = verifyEmailSubject;
    const body = `${process.env.ADMIN_PORTAL}/${setupPassword}`;
    await sendEmail({ to, subject, body });

    hospitalGroupResult.image = key;
    await hospitalGroupResult.save();

    return hospitalGroupResult;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getAllTherapeuticAreas,
  createNewHospital,
  createNewHospitalGroup,
};
