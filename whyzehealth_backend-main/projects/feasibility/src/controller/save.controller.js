const { SaveService } = require('../service');

const saveFeasibilityStudyProject = async (req, res) => {
  const { project, feasibilityStudy } = req.body;
  const { userId } = req.userProfile;

  try {
    const result = await SaveService.saveFeasibilityStudy(
      userId,
      project,
      feasibilityStudy,
    );
    return res.status(200).send(result);
  } catch (error) {
    console.log('Error :', error);
    return res.sendStatus(400);
  }
};

const getFeasibilityStudyProject = async (req, res) => {
  try {
    const { userId } = req.userProfile;
    const result = await SaveService.getFeasibilityStudy(userId);
    return res.status(200).send(result);
  } catch (error) {
    console.log('Error :', error);
    return res.sendStatus(400);
  }
};

const getFeasibilityStudyProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SaveService.getFeasibilityStudyById(id);
    return res.status(200).send(result);
  } catch (error) {
    console.log('Error :', error);
    return res.sendStatus(400);
  }
};

module.exports = {
  saveFeasibilityStudyProject,
  getFeasibilityStudyProject,
  getFeasibilityStudyProjectById,
};
