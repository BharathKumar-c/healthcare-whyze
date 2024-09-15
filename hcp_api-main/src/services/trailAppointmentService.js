/* eslint-disable no-useless-catch */
const { accepted, callBack } = require('../appConstants/displayConstant');
const { errorConstants } = require('../appConstants/errorConstant');
const {
  appointmentScheduled,
  droppedOut,
} = require('../appConstants/statusConstants');
const {
  InviteResearchSites,
  ClinicalTrialAppointment,
  DoctorNotification,
} = require('../models');

const getDescriptionandDates = async ({ userId, hcpId }) => {
  try {
    const appointmentDate = await ClinicalTrialAppointment.findOne({
      patient: userId,
      invite_research_site: hcpId,
    })
      .select('invite_research_site patient study_status_date _id')
      .lean();

    const clinicalTrialDescription = await InviteResearchSites.findOne({
      clinical_trial_appointments: { $in: [appointmentDate._id] },
    }).select('_id trial_status clinical_trial description sponsor');
    return {
      appointmentDate,
      title: clinicalTrialDescription.clinical_trial,
      description: clinicalTrialDescription.description,
    };
  } catch (error) {
    throw error;
  }
};
const checkCallBackRequest = async ({ userId, inviteResearchSiteId }) => {
  const checkAppointment = await ClinicalTrialAppointment.findOne({
    $and: [{ patient: userId }, { invite_research_site: inviteResearchSiteId }],
  });
  if (checkAppointment && checkAppointment.study_status_date.length > 0) {
    if (checkAppointment?.upcoming_visit === 0) {
      const checkAlreadyExist = await DoctorNotification.findOne({
        patient_id: userId,
        invite_research_site: inviteResearchSiteId,
      });
      if (checkAlreadyExist) {
        await DoctorNotification.updateOne(
          { patient_id: userId, invite_research_site: inviteResearchSiteId },
          {
            is_readed: false,
            is_assigned: false,
            clinical_trial_appointments: checkAppointment._id,
          },
        );
      } else {
        await DoctorNotification.create({
          patient_id: userId,
          invite_research_site: inviteResearchSiteId,
          status: callBack,
          clinical_trial_appointments: checkAppointment._id,
        });
      }
    } else {
      const checkAlreadyExist = await DoctorNotification.findOne({
        patient_id: userId,
        invite_research_site: inviteResearchSiteId,
      });
      if (checkAlreadyExist) {
        await DoctorNotification.updateOne(
          { patient_id: userId, invite_research_site: inviteResearchSiteId },
          {
            is_readed: false,
            is_assigned: false,
            clinical_trial_appointments: checkAppointment._id,
          },
        );
      } else {
        await DoctorNotification.create({
          patient_id: userId,
          invite_research_site: inviteResearchSiteId,
          status: accepted,
          clinical_trial_appointments: checkAppointment._id,
        });
      }
    }
  }
};
const updateTrialAppointmentDate = async ({
  userId,
  inviteResearchSiteId,
  clinicalTrialAppointmentId,
}) => {
  try {
    const checkIsExist = await ClinicalTrialAppointment.findOne({
      $and: [
        {
          patient: userId,
        },
        {
          invite_research_site: inviteResearchSiteId,
        },
        {
          study_status_date: {
            $in: clinicalTrialAppointmentId,
          },
        },
      ],
    });
    if (clinicalTrialAppointmentId < 0 && !checkIsExist) {
      throw new Error(errorConstants.checkResearchId);
    }
    await ClinicalTrialAppointment.updateOne(
      {
        patient: userId,
        invite_research_site: inviteResearchSiteId,
      },
      {
        upcoming_visit: clinicalTrialAppointmentId,
        status:
          clinicalTrialAppointmentId === 1 ? droppedOut : appointmentScheduled,
      },
    );
    await checkCallBackRequest({
      userId,
      inviteResearchSiteId,
    });
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getDescriptionandDates,
  updateTrialAppointmentDate,
};
