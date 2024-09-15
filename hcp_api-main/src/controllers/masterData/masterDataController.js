const { masterService } = require('../../services');
const {
  relationAdded,
  caseAdded,
  allergiesAdded,
  emptyAllergies,
  emptyFAQ,
  addedFAQ,
} = require('../../appConstants/displayConstant');

const addMasterRealtionship = async (req, res) => {
  try {
    await masterService.addMasterRealtionshipDetails(
      req.body,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: relationAdded });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const addMasterCase = async (req, res) => {
  try {
    await masterService.addMasterCaseDetails(req.body, req.userProfile.userId);
    return res.status(200).send({ message: `${caseAdded}` });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const addMasterAllergies = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({ message: emptyAllergies });
    }

    await masterService.addMasterAllergiesDetails(
      req.body,
      req.userProfile.userId,
    );
    return res.status(200).send({ message: allergiesAdded });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const addFAQ = async (req, res) => {
  try {
    if (!req.body.question_title || !req.body.answer_text) {
      return res.status(400).send({ message: emptyFAQ });
    }

    await masterService.createFAQ(req.body, req.userProfile.userId);
    return res.status(200).send({ message: addedFAQ });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  addMasterRealtionship,
  addMasterCase,
  addMasterAllergies,
  addFAQ,
};
