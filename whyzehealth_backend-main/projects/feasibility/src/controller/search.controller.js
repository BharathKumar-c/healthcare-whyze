const { SearchService } = require('../service');

const getUniqueIndicationController = async (req, res) => {
  try {
    const { value } = req.query;
    const result = await SearchService.getUniquePatientCondition(value);
    return res.status(200).json({ result });
  } catch (error) {
    console.log('Error :', error);
    return res.sendStatus(400);
  }
};

const getUniqueMedicationController = async (req, res) => {
  try {
    const { value } = req.query;
    const result = await SearchService.getUniqueMedication(value);
    return res.status(200).json({ result });
  } catch (error) {
    console.log('Error :', error);
    return res.sendStatus(400);
  }
};

module.exports = {
  getUniqueIndicationController,
  getUniqueMedicationController,
};
