/* eslint-disable no-useless-catch */
const {
  singleHospital,
  hospitalGroup,
  researchOrganization,
} = require('../appConstants/roleConstant');
const tenant = require('../models/tenant');

const getHospitalAndOrganizationsCount = async () => {
  try {
    const hospitalCount = await tenant
      .find({
        type_of_organization: { $in: [singleHospital, hospitalGroup] },
      })
      .countDocuments();

    const researchOrganizationsCount = await tenant
      .find({
        type_of_organization: researchOrganization,
      })
      .countDocuments();

    return {
      hospitals: hospitalCount,
      researchOrganizations: researchOrganizationsCount,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getHospitalAndOrganizationsCount,
};
