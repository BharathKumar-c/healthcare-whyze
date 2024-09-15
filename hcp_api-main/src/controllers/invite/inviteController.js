const { inviteService } = require('../../services');

const getAllTherapeuticAreasList = async (req, res) => {
  try {
    const getAllTherapeuticAreas = await inviteService.getAllTherapeuticAreas();
    return res.status(200).json({ getAllTherapeuticAreas });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const createHospital = async (req, res) => {
  try {
    const result = await inviteService.createNewHospital(req.body, req.file);
    return res.status(200).send({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const createHospitalGroup = async (req, res) => {
  try {
    const result = await inviteService.createNewHospitalGroup(
      req.body,
      req.file,
    );
    return res.status(200).send({ result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  getAllTherapeuticAreasList,
  createHospital,
  createHospitalGroup,
};
