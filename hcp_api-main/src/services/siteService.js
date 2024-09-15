/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable indent */
/* eslint-disable no-useless-catch */

const {
  newTrial,
  trialInvited,
  newTrialInvitation,
  newTrialInitiated,
  activeTrial,
  success,
  successInviteSent,
} = require('../appConstants/displayConstant');
const { errorConstants } = require('../appConstants/errorConstant');
const {
  sendResearchInvite,
  sendEligibleNotification,
  sendEnrollingNotification,
} = require('../appConstants/notificationConstant');
const { consenting, enrolled } = require('../appConstants/statusConstants');
const {
  User,
  InviteResearchSites,
  ClinicalTrialAppointment,
  DoctorNotification,
} = require('../models');
const { tablePagination } = require('../utils/paginationUtils');
const { sendEmail } = require('./emailService');
const { sendPushNotificationByUserID } = require('./fcmService');

const inviteSites = async (data, correlationId) => {
  try {
    console.log(
      `Trial details received = correlationId:${correlationId}, projectId: ${data.projectId}, segmentId: ${data.segmentId}, siteId: ${data.siteDetails._id}, totalPatients: ${data.patients?.length}`,
    );

    const inviteResearchSite = await InviteResearchSites.create({
      trial_status: newTrial,
      clinical_trial: data.clinicalTrial,
      sponsor: data.sponsor,
      description: data.description,
      research_project: data.projectId,
      segment: data.segmentId,
      created_by: data.researchUserId,
      site: data.siteDetails._id,
      total_patients: data.siteDetails.connected,
      feasibility_study: data.feasibilityStudy,
    });

    const clinicalAppointmentsData = data.patients.map(val => ({
      patient: val._id,
      invite_research_site: inviteResearchSite._id,
      upcoming_visit: null,
      eligibility: JSON.stringify(val.percentageCriteria),
      study_status_date: null,
    }));

    const clinicalAppointments = await ClinicalTrialAppointment.insertMany(
      clinicalAppointmentsData,
    );

    const clinicalAppointmentIds = clinicalAppointments.map(
      appointment => appointment._id,
    );

    await InviteResearchSites.updateOne(
      { _id: inviteResearchSite._id },
      { $set: { clinical_trial_appointments: clinicalAppointmentIds } },
    );

    const to = data?.siteDetails?.email;
    const subject = newTrialInvitation;
    const body = newTrialInitiated;
    await sendEmail({ to, subject, body });
    return {
      message: trialInvited,
    };
  } catch (error) {
    throw error;
  }
};

const trialDetails = async userId => {
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const researchSites = await InviteResearchSites.find({
      site: { $in: [user.tenant] },
    });

    return researchSites;
  } catch (error) {
    throw error;
  }
};

const markParticipateByTrialId = async (id, userId) => {
  try {
    await InviteResearchSites.findOneAndUpdate(
      { _id: id },
      { trial_status: activeTrial, trial_participated_by: userId },
    );
    return {
      message: success,
    };
  } catch (error) {
    throw error;
  }
};

const trialDetailsById = async id => {
  try {
    return InviteResearchSites.findById(id).select(
      '-created_on -updated_on -__v',
    );
  } catch (error) {
    throw error;
  }
};

const getPatientList = async (id, page, perPage, filterQuery) => {
  try {
    const { skip, limit } = tablePagination(page, perPage);

    const nameFilter = filterQuery
      ? {
          $or: [
            { first_name: { $regex: filterQuery, $options: 'i' } },
            { last_name: { $regex: filterQuery, $options: 'i' } },
          ],
        }
      : {};

    const baseQuery = {
      select:
        '-created_on -updated_on -created_by -updated_by -__v -password -email_verification_token -forgot_password_token',
      match: nameFilter,
    };

    const patientListPerPage = await ClinicalTrialAppointment.find({
      invite_research_site: id,
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'patient',
        model: 'User',
        ...baseQuery,
      });

    const allPatientsinTrial = await ClinicalTrialAppointment.find({
      invite_research_site: id,
    }).populate({
      path: 'patient',
      model: 'User',
      ...baseQuery,
    });

    if (!patientListPerPage) {
      return null;
    }

    const totalCount = allPatientsinTrial.length;

    return [patientListPerPage, totalCount];
  } catch (error) {
    throw error;
  }
};

const markFavourite = async (id, is_favourite) => {
  try {
    await InviteResearchSites.updateOne({ _id: id }, { is_favourite });
    return {
      message: 'Marked as favourite',
    };
  } catch (error) {
    throw error;
  }
};

const deleteTrial = async id => {
  try {
    return InviteResearchSites.deleteOne({ _id: id });
  } catch (error) {
    throw error;
  }
};
const createClinicalTrialAppointment = async ({
  patientId,
  inviteResearchSiteId,
  dates,
  status,
  hcpId,
}) => {
  try {
    const checkIsExist = await InviteResearchSites.findOne({
      _id: inviteResearchSiteId,
    });
    if (!checkIsExist) {
      throw new Error(errorConstants.checkResearchId);
    }
    const checkAlreadyAppointmentAssigned =
      await ClinicalTrialAppointment.findOne({
        patient: patientId,
        invite_research_site: inviteResearchSiteId,
      });
    if (checkAlreadyAppointmentAssigned) {
      await ClinicalTrialAppointment.updateOne(
        { patient: patientId, invite_research_site: inviteResearchSiteId },
        {
          $set: {
            status,
            study_status_date: dates?.map(ele => ele),
            upcoming_visit: null,
          },
        },
      );
    } else {
      const ClinicalTrialAppointments = await ClinicalTrialAppointment.create({
        patient: patientId,
        invite_research_site: inviteResearchSiteId,
        status,
        study_status_date: dates?.map(ele => ele),
      });
      await InviteResearchSites.updateOne(
        { _id: inviteResearchSiteId },
        {
          $push: { clinical_trial_appointments: ClinicalTrialAppointments._id },
        },
      );
    }
    const doctorDetails = await User.findOne({ _id: hcpId });
    sendResearchInvite.body = sendResearchInvite.body.replace(
      '{DoctorName}',
      `${doctorDetails?.first_name || ''} ${doctorDetails?.last_name || ''}`,
    );
    sendResearchInvite.data.hcpId = inviteResearchSiteId;
    await sendPushNotificationByUserID({
      user_id: patientId,
      ...sendResearchInvite,
    });
    return successInviteSent;
  } catch (error) {
    throw error;
  }
};
const updateClinicalTrialAppointmentStatus = async ({
  patientId,
  inviteResearchSiteId,
  status,
  inEligibleReason,
}) => {
  await ClinicalTrialAppointment.updateOne(
    { patient: patientId, invite_research_site: inviteResearchSiteId },
    {
      $set: {
        status,
        in_eligible_reason: inEligibleReason,
      },
    },
  );
  const clinicalTrialDetails = await InviteResearchSites.findOne({
    _id: inviteResearchSiteId,
  });
  if (status === consenting) {
    sendEligibleNotification.body = sendEligibleNotification.body.replace(
      '{ClinicalName}',
      `${clinicalTrialDetails.clinical_trial || ''}`,
    );
    await sendPushNotificationByUserID({
      user_id: patientId,
      ...sendEligibleNotification,
    });
  }
  if (status === enrolled) {
    sendEnrollingNotification.body = sendEnrollingNotification.body.replace(
      '{ClinicalName}',
      `${clinicalTrialDetails.clinical_trial || ''}`,
    );
    await sendPushNotificationByUserID({
      user_id: patientId,
      ...sendEnrollingNotification,
    });
  }
  return successInviteSent;
};
const getAppointmentNotifications = async ({ id }) => {
  try {
    return DoctorNotification.find({
      invite_research_site: id,
    })
      .populate([
        {
          path: 'patient_id',
          model: 'User',
        },
        {
          path: 'clinical_trial_appointments',
          model: 'ClinicalTrialAppointment',
        },
        {
          path: 'invite_research_site',
          model: 'InviteResearchSites',
        },
      ])
      .select('-created_on -updated_on -__v ');
  } catch (error) {
    throw error;
  }
};
const getNotificationCounts = async ({ id }) => {
  try {
    return DoctorNotification.find({
      $and: [{ invite_research_site: id }, { is_readed: false }],
    }).count();
  } catch (error) {
    throw error;
  }
};
const updateNotificationCounts = async ({ id }) => {
  try {
    return DoctorNotification.updateMany(
      { invite_research_site: id },
      { is_readed: true },
    );
  } catch (error) {
    throw error;
  }
};
module.exports = {
  inviteSites,
  trialDetails,
  markParticipateByTrialId,
  trialDetailsById,
  getPatientList,
  markFavourite,
  deleteTrial,
  createClinicalTrialAppointment,
  getAppointmentNotifications,
  getNotificationCounts,
  updateNotificationCounts,
  updateClinicalTrialAppointmentStatus,
};
