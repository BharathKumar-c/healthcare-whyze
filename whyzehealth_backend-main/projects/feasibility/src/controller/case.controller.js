const { CaseService } = require('../service');

const getCaseCountDetails = async (req, res) => {
  try {
    const result = await CaseService.getFeasibilityDetails(req.body);
    return res.status(200).send(result);
  } catch (error) {
    console.log('Error :', error);
    return res.sendStatus(400);
  }
};

const getPatientCount = async (req, res) => {
  try {
    const result = await CaseService.getFeasibilityStudyPatientCount(req.query);
    return res.status(200).send(result);
  } catch (error) {
    console.log('Error :', error);
    return res.sendStatus(400);
  }
};

module.exports = {
  getCaseCountDetails,
  getPatientCount,
};
