const {
  DietaryMaster,
  HealthInsuranceMaster,
  HealthInsurancePlanMaster,
  FamilyRealtionshipMaster,
  CaseShema,
  AllergiesMaster,
  Faq,
  CountryListMaster,
} = require('../models');

const getAllDiet = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await DietaryMaster.find().select({ name: 1 });
    return result.map(({ dietary_id, name }) => ({ dietary_id, name }));
  } catch (error) {
    throw error;
  }
};

const getHIMasterData = async () => {
  try {
    const query = { is_system_added: true };

    const results = await HealthInsuranceMaster.find(query)
      .select('name country health_insurance_master_id')
      .exec();

    const formattedResults = results.map(result => ({
      name: result.name || '',
      country: result.country || '',
      health_insurance_master_id: result.health_insurance_master_id,
    }));
    return formattedResults;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getHIMasterPlanData = async ({ health_insurance_master_id }) => {
  try {
    const results = await HealthInsurancePlanMaster.find({
      health_insurance: health_insurance_master_id,
    })
      .select('name health_insurance_plan_master_id')
      .exec();

    const formattedResults = results.map(result => ({
      name: result.name || '',
      health_insurance_plan_master_id: result.health_insurance_plan_master_id,
    }));

    return formattedResults;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addMasterRealtionshipDetails = async (caseObj, userId) => {
  try {
    return FamilyRealtionshipMaster.create({
      ...caseObj,
      created_by: userId,
      updated_by: userId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addMasterAllergiesDetails = async (caseObj, userId) => {
  try {
    return AllergiesMaster.create({
      ...caseObj,
      created_by: userId,
      updated_by: userId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createFAQ = async caseObj => {
  try {
    return Faq.create({
      ...caseObj,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addMasterCaseDetails = async (caseObj, userId) => {
  try {
    return CaseShema.create({
      ...caseObj,
      created_by: userId,
      updated_by: userId,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllCountriesList = async val => {
  try {
    const regexValue = new RegExp(val, 'i');
    const query = val ? { name: { $regex: regexValue } } : {};

    const result = await CountryListMaster.find(query).select({
      name: 1,
    });

    return result
      ?.map(({ country_list_master_id, name }) => ({
        country_id: country_list_master_id,
        name,
        index: name?.toLowerCase().indexOf(val?.toLowerCase()),
      }))
      ?.sort((a, b) => a.index - b.index)
      ?.map(({ country_id, name }) => ({
        country_id,
        name,
      }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getAllDiet,
  getHIMasterData,
  getHIMasterPlanData,
  addMasterRealtionshipDetails,
  addMasterAllergiesDetails,
  addMasterCaseDetails,
  createFAQ,
  getAllCountriesList,
};
