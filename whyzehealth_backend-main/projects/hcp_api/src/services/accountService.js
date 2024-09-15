/* eslint-disable no-useless-catch */
const moment = require('moment');
const bcrypt = require('bcryptjs');
const {
  User,
  Invite,
  Patient,
  Preference,
  Tenant,
  Appointments,
  MedicalCondition,
} = require('../models');
const smsService = require('./smsService');
const jwtService = require('./jwtService');
const emailService = require('./emailService');
const {
  getPatientByUserId,
  getPatientDetailsByEmail,
} = require('./patientService');
const { startDateFormatter, endDateFormatter } = require('../utils/dateUtils');

const checkEmailExists = async email => {
  const user = await User.exists({ email });
  return !!user;
};

const sendPhoneVerfication = async phone => {
  try {
    // generating random OTP pin
    const randomOTP = Math.floor(100000 + Math.random() * 900000);

    const invite = await Invite.create({
      phone,
      phone_verification_code: randomOTP,
      phone_no_of_attempts: 0,
      phone_verified: false,
    });

    await smsService.sendSMS({
      message: `Your Verification OTP Code is ${randomOTP}`,
      phone,
    });

    return {
      phone_number: phone,
      verification_id: invite.invite_id,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sendEmailVerification = (email, token) => {
  const link = `${process.env.API_URL}/patient/${process.env.API_VERSION}/account/email_verify?token=${token}`;
  return emailService.sendTemplatedEmail({
    to: email,
    data: { link, year: moment().format('YYYY') },
  });
};

const confirmPhoneNumber = async ({
  phone_number,
  verification_code,
  verification_id,
}) => {
  try {
    if (
      process.env.APP_ENV === 'dev' &&
      verification_code === process.env.DEFAULT_OTP_FOR_DEV
    ) {
      await Invite.findOneAndUpdate(
        { invite_id: verification_id },
        { phone_verified: true },
      );

      return {
        phone_number,
        phone_verification_id: verification_id,
      };
    }
    await Invite.findOneAndUpdate(
      { invite_id: verification_id },
      { $inc: { phone_no_of_attempts: 1 } },
    );

    const invite = await Invite.findOne({
      invite_id: verification_id,
      phone: phone_number,
      phone_verification_code: verification_code,
      created_on: {
        // setting expire time 3 minutes
        $gt: moment().subtract(30, 'minute').toDate(),
      },
    });
    if (invite) {
      if (invite?.phone_no_of_attempts > 3) {
        // maximum no of attempts is 3
        throw Error(
          'You exceeded the maximum number of attempts. Please request OTP again',
        );
      }
      invite.phone_verified = true;
      await invite.save();
      return {
        phone_number,
        phone_verification_id: verification_id,
      };
    }
    throw Error('The OTP you entered is invalid or expired');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const register = async ({
  email,
  password,
  phone_number,
  phone_verification_id,
  role,
}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const exist = await checkEmailExists(email);
    if (exist) throw Error('email already exists');

    const invite = await Invite.findById(phone_verification_id);

    if (!invite || invite?.phone !== phone_number) {
      throw Error('phone_number is not verified');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      phone_number,
      role,
    });
    const token = jwtService.createToken(user, 'email_verification');
    user.email_verification_token = token;

    const defaultObj = {
      patient: user.user_id,
      created_by: user.user_id,
      updated_by: user.user_id,
    };

    const patientObj = await Patient.create(defaultObj);

    const preferenceObj = await Preference.create(defaultObj);

    user.patient_detail = patientObj.patient_id;
    user.preference = preferenceObj.preference_id;

    await user.save();

    await sendEmailVerification(email, token);
    return {
      user_id: user.user_id,
      email,
    };
  } catch (error) {
    throw error;
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      throw Error('User does not exist');
    }

    if (!user.email_verified) {
      throw Error('Email is not verified');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      const patient = await getPatientByUserId(user._id);
      user.patient_id = patient._id;
      const tokens = await jwtService.generateUserTokens(user);
      return tokens;
    }
    throw Error('Invalid Email or Password');
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const verifyEmail = async token => {
  try {
    const payload = await jwtService.verifyToken(token, 'email_verification');
    await User.findByIdAndUpdate(payload.user_id, { email_verified: true });
    return {
      message: 'Email verified',
    };
  } catch (error) {
    console.log(error);
    throw Error('The link has expired.');
  }
};

const generateAccessTokenByRefreshToken = async refresh_token => {
  try {
    const payload = await jwtService.verifyToken(
      refresh_token,
      'refresh_token',
    );

    const access_token = jwtService.createToken(payload, 'access_token');
    return { access_token, refresh_token };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sendEmail = async ({ email, userId }) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const token = jwtService.createToken(email, 'email_verification');
    const updateData = {
      email_verification_token: token,
    };
    await sendEmailVerification(email, token);
    await User.updateOne(
      { _id: userId },
      { ...updateData, updated_by: userId },
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const checkExistingPatient = async (
  firstName,
  lastName,
  dob,
  addressLine1,
  addressLine2,
  addressLine3,
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const startDate = startDateFormatter(dob);
    const endDate = endDateFormatter(dob);
    const matchedRecord = await User.findOne({
      first_name: firstName,
      last_name: lastName,
      dob: { $gte: startDate, $lt: endDate },
      address_line1: addressLine1,
      address_line2: addressLine2,
      address_line3: addressLine3,
    }).select('user_id first_name last_name');

    if (!matchedRecord) {
      return null;
    }
    const result = {
      user_id: matchedRecord.user_id,
      first_name: matchedRecord.first_name,
      last_name: matchedRecord.last_name,
    };

    return result;
  } catch (error) {
    throw error;
  }
};

const getTenantsByUserId = async userId => {
  // eslint-disable-next-line no-useless-catch
  try {
    const userTenant = await User.find({
      _id: userId,
    });
    const tenants = await Tenant.find({
      _id: userTenant[0].tenant[userTenant[0].tenant.length - 1].toString(),
    }).select('tenant_id name');
    return tenants.map(({ tenant_id, name }) => ({ tenant_id, name }));
  } catch (error) {
    throw error;
  }
};

const confirmTenantById = async (tenant, id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = await User.find({
      _id: { $in: id },
      tenant: { $in: [tenant] },
    });
    if (data.length > 0) {
      const tenants = await Tenant.find({
        _id: tenant,
      }).select('tenant_id name');
      return tenants.map(({ tenant_id, name }) => ({ tenant_id, name }));
    }
  } catch (error) {
    throw error;
  }
};

const getTenantsNotByUserId = async (tenant, id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const users = await User.find({
      _id: { $ne: id },
      tenant: { $exists: true, $ne: [] },
      role: { $ne: 'hcp' },
    }).limit(3);
    const tenantList = [];
    users.map(val => tenantList.push(val.tenant.toString()));
    const tenants = await Tenant.find({
      _id: { $in: tenantList[0], $nin: tenant },
    }).select('tenant_id name');
    return tenants.map(({ tenant_id, name }) => ({ tenant_id, name }));
  } catch (error) {
    throw error;
  }
};

const getUserHcp = async (tenant, id) => {
  const hcpList = [];
  const hcpIds = [];
  // eslint-disable-next-line no-useless-catch
  try {
    const sort = { end_date: -1 };
    const getAllHcpByTenant = await User.find({
      role: 'hcp',
      tenant: { $in: [tenant] },
    });

    getAllHcpByTenant.map(val => hcpIds.push(val.user_id.toString()));

    const getAppointment = await Appointments.find({
      patient: { $in: id },
      hcp: { $in: hcpIds },
    })
      .sort(sort)
      .select('hcp hcp_name');

    const otherHcpAppointments = await Appointments.find({
      patient: { $nin: id },
      hcp: { $nin: hcpIds },
    })
      .select('hcp hcp_name')
      .limit(3);

    if (getAppointment.length > 0) {
      hcpList.push(getAppointment[0], ...otherHcpAppointments);
    } else {
      hcpList.push(...otherHcpAppointments);
    }

    return hcpList.map(({ hcp: hcp_id, hcp_name }) => ({ hcp_id, hcp_name }));
  } catch (error) {
    throw error;
  }
};

const confirmHcpById = async (hcp, id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return Appointments.find({
      patient: id,
      hcp,
    });
  } catch (error) {
    throw error;
  }
};

const getHcpYearById = async (hcp, id) => {
  const year = [];

  // eslint-disable-next-line no-useless-catch
  try {
    const sort = { end_date: -1 };
    const hcpYear = await Appointments.find({
      patient: id,
      hcp,
    }).sort(sort);

    // hcpYear.map(val => year.push(new Date(val.end_date).getFullYear()));
    if (hcpYear.length > 0) {
      year.push(new Date(hcpYear[0].end_date).getFullYear());
    }

    const otherHcpYear = await Appointments.find({
      patient: { $nin: id },
      hcp: { $nin: hcp },
    })
      .sort(sort)
      .limit(3);

    if (otherHcpYear.length > 0) {
      otherHcpYear.map(
        val =>
          !year.includes(new Date(val.end_date).getFullYear()) &&
          year.push(new Date(val.end_date).getFullYear()),
      );
    }
    return year;
  } catch (error) {
    throw error;
  }
};

const confirmHcpYear = async (hcp, year, id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const sort = { end_date: -1 };
    const getAppointment = await Appointments.find({
      patient: { $in: id },
      hcp: { $in: hcp },
    }).sort(sort);

    if (getAppointment.length > 0) {
      const hcpYear = new Date(getAppointment[0].end_date).getFullYear();
      if (year.toString() === hcpYear.toString()) {
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

const getHealthConditionByUserId = async id => {
  const conditionArray = [];
  // eslint-disable-next-line no-useless-catch
  try {
    const sort = { created_on: -1 };
    const condition = await MedicalCondition.find({
      patient: { $in: id },
    })
      .sort(sort)
      .select('medical_condition_id name');

    const otherIdCondition = await MedicalCondition.find({
      patient: { $nin: id },
    })
      .select('medical_condition_id name')
      .limit(3);
    conditionArray.push(condition[0], ...otherIdCondition);
    return conditionArray.map(({ id: condition_id, name: condition_name }) => ({
      condition_id,
      condition_name,
    }));
  } catch (error) {
    throw error;
  }
};

const confirmHealthConditionByUserId = async (conditionId, userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const sort = { created_on: -1 };
    const latestCondition = await MedicalCondition.findOne({
      patient: { $in: userId },
    })
      .sort(sort)
      .select('medical_condition_id');

    return latestCondition.medical_condition_id.toString() === conditionId;
  } catch (error) {
    throw error;
  }
};

const updateExistingUserAndDeleteNewUser = async (existingUserId, userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { email, phone_number } = await User.findOne({
      user_id: { $in: userId },
    });
    await User.findByIdAndUpdate(existingUserId, { email, phone_number });
    await User.deleteOne({ user_id: userId });
    return { message: 'User imported' };
  } catch (error) {
    throw error;
  }
};

const updatePhoneNumber = async (phone_number, userId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await User.findByIdAndUpdate(userId, { phone_number });
    return { message: 'Phone number verified' };
  } catch (error) {
    throw error;
  }
};

const forgotPassword = async ({ email }) => {
  try {
    const user = await getPatientDetailsByEmail({ email });
    if (user) {
      const token = jwtService.createToken(user, 'forgot_password');
      const link = `${process.env.API_URL}/patient/${process.env.API_VERSION}/account/reset_password_verify?token=${token}`;
      const fullName = ` ${user.first_name || ''} ${user.last_name || ''}`;
      user.forgot_password_token = token;
      user.save();
      return emailService.sendTemplatedEmail({
        to: email,
        Template: 'whyze-forgot-password-template',
        data: { link, year: moment().format('YYYY'), fullName },
      });
    }
    throw Error('This email does not exist');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  forgotPassword,
  checkEmailExists,
  sendPhoneVerfication,
  confirmPhoneNumber,
  register,
  login,
  generateAccessTokenByRefreshToken,
  verifyEmail,
  sendEmail,
  checkExistingPatient,
  getTenantsByUserId,
  confirmTenantById,
  getTenantsNotByUserId,
  getUserHcp,
  confirmHcpById,
  getHcpYearById,
  confirmHcpYear,
  getHealthConditionByUserId,
  confirmHealthConditionByUserId,
  updateExistingUserAndDeleteNewUser,
  updatePhoneNumber,
};
