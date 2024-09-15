const { success } = require('../../appConstants/displayConstant');
const { errorConstants } = require('../../appConstants/errorConstant');
const { trailAppointmentService } = require('../../services');

const getDescriptionandDate = async (req, res) => {
  try {
    const result = await trailAppointmentService.getDescriptionandDates({
      userId: req.userProfile.userId,
      hcpId: req.params.id,
    });
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};
const updateTrailAppointment = async (req, res) => {
  try {
    const { clinicalTrialAppointmentId } = req.body;
    const { id } = req.params;
    if (clinicalTrialAppointmentId < 0 || !id) {
      throw new Error(errorConstants.someFieldAreMissing);
    }
    await trailAppointmentService.updateTrialAppointmentDate({
      userId: req.userProfile.userId,
      inviteResearchSiteId: id,
      clinicalTrialAppointmentId,
    });
    return res.status(200).json({ message: success });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  getDescriptionandDate,
  updateTrailAppointment,
};
