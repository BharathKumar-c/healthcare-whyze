const { patientService, masterService } = require('../../services');

const createLifeStyleAndHealth = async (req, res) => {
  try {
    const reqBody = req.body;
    const data = {
      is_smoker: reqBody.is_smoker,
      alcohol_weekly_frequency: reqBody.alcohol_weekly_frequency,
      dietary: reqBody.dietary,
      smoke_frequency: reqBody.is_smoker ? reqBody.smoke_frequency : '',
      smoke_start_year: reqBody.is_smoker
        ? reqBody.smoke_start_year
        : reqBody.smoke_start_year || '',
      smoke_quite_year: reqBody.is_smoker
        ? reqBody.smoke_quite_year || ''
        : reqBody.smoke_quite_year || '',
    };
    await patientService.updatePatientDetails(data, req.userProfile.userId);
    return res.status(200).send();
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getAllDiet = async (req, res) => {
  try {
    const dietList = await masterService.getAllDiet();
    return res.status(200).send({ data: dietList });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = { createLifeStyleAndHealth, getAllDiet };
