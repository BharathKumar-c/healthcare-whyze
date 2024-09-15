const {
  updatedPreference,
  success,
} = require('../../appConstants/displayConstant');
const { preferenceService } = require('../../services');

const getPreferenceDetails = async (req, res) => {
  try {
    const preferenceDetails = await preferenceService.getPreferenceDetails(
      req.userProfile.userId,
    );
    res.status(200).send(preferenceDetails);
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const createOrUpdatePatientPreferenceMap = async (req, res) => {
  try {
    const reqBody = req.body;
    await preferenceService.createOrUpdatePatientPreferenceMap(
      reqBody,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: success });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updatePreference = async (req, res) => {
  try {
    const reqBody = req.body;
    const { id } = req.params;

    await preferenceService.updatePreference(
      reqBody,
      req.userProfile.userId,
      id,
    );

    return res.status(200).send({
      message: updatedPreference,
    });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  getPreferenceDetails,
  createOrUpdatePatientPreferenceMap,
  updatePreference,
};
