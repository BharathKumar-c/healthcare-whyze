const { success } = require('../../appConstants/displayConstant');
const { errorConstants } = require('../../appConstants/errorConstant');
const { siteService } = require('../../services');

// Below Research Portal Controller API
const inviteSitesToTrial = async (req, res) => {
  try {
    const result = await siteService.inviteSites(
      req.body,
      req.headers.correlation_id,
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getTrials = async (req, res) => {
  const { userId } = req.userProfile;
  if (!userId) {
    return res.status(400);
  }
  try {
    const result = await siteService.trialDetails(userId);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const participateTrial = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.userProfile;

  if (!id) {
    return res.status(400);
  }
  try {
    const result = await siteService.markParticipateByTrialId(id, userId);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getTrialById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400);
  }
  try {
    const result = await siteService.trialDetailsById(id);
    return res.status(200).send({ trial: result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getPatientListById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400);
  }
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;

    const [patientListPerPage, totalCount] = await siteService.getPatientList(
      id,
      page,
      perPage,
      req.query.filterQuery,
    );

    return res
      .status(200)
      .json({ rows: patientListPerPage, count: totalCount });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const updateTrialFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFavourite } = req.body;
    if (typeof isFavourite !== 'boolean') {
      return res.status(400);
    }
    const result = await siteService.markFavourite(id, isFavourite);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const deleteTrialById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400);
    }
    await siteService.deleteTrial(id);
    return res.status(200).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const createClinicalTrialAppointment = async (req, res) => {
  try {
    const { patientId, inviteResearchSiteId, dates, status } = req.body;
    if (!patientId || !inviteResearchSiteId || !dates || !status) {
      return res
        .status(400)
        .send({ message: errorConstants.someFieldAreMissing });
    }
    await siteService.createClinicalTrialAppointment({
      patientId,
      inviteResearchSiteId,
      dates,
      status,
      hcpId: req.userProfile.userId,
    });
    return res.status(200).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error.message || '' });
  }
};
const updateClinicalTrialAppointmentsStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientId, status, inEligibleReason } = req.body;
    if (!patientId || !id || !status) {
      return res
        .status(400)
        .send({ message: errorConstants.someFieldAreMissing });
    }
    await siteService.updateClinicalTrialAppointmentStatus({
      patientId,
      inviteResearchSiteId: id,
      status,
      inEligibleReason,
    });
    return res.status(200).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const getAppointmentNotification = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error(errorConstants.researchIdRequired);
    }
    const result = await siteService.getAppointmentNotifications({
      id,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const getNotificationCount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error(errorConstants.researchIdRequired);
    }
    const result = await siteService.getNotificationCounts({
      id,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const updateNotificationCount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error(errorConstants.researchIdRequired);
    }
    await siteService.updateNotificationCounts({
      id,
    });
    return res.status(200).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
module.exports = {
  inviteSitesToTrial,
  getTrials,
  participateTrial,
  getTrialById,
  getPatientListById,
  updateTrialFavourite,
  deleteTrialById,
  createClinicalTrialAppointment,
  getAppointmentNotification,
  getNotificationCount,
  updateNotificationCount,
  updateClinicalTrialAppointmentsStatus,
};
