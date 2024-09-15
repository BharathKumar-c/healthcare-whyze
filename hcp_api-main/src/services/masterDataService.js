const { FamilyRealtionshipMaster } = require('../models');

const addMasterRealtionshipDetails = async (caseObj, userId) => {
  try {
    FamilyRealtionshipMaster.create({
      patient: userId,
      ...caseObj,
      created_by: userId,
      updated_by: userId,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  addMasterRealtionshipDetails,
};
