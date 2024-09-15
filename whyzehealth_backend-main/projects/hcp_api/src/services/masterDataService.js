const { norelation } = require('../appConstants/displayConstant');
const { FamilyRealtionshipMaster } = require('../models');

const getMasterRealtionshipDetails = async name => {
  try {
    const regexValue = new RegExp(name, 'i');
    const query = name ? { relation_type: { $regex: regexValue } } : {};

    const result = await FamilyRealtionshipMaster.find(query).select(
      '-created_by -updated_by -created_on -updated_on -__v',
    );

    if (result.length === 0) {
      return { message: norelation };
    }
    const transformedResult = result.map(ele => ({
      family_realtionship_master_id: ele._id,
      name: ele?.name,
    }));

    return transformedResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addMasterRealtionshipDetails = async (caseObj, userId) => {
  try {
    FamilyRealtionshipMaster.create({
      patient: userId,
      ...caseObj,
      created_by: userId,
      updated_by: userId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addMasterRealtionshipDetails,
  getMasterRealtionshipDetails,
};
