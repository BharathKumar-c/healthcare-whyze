const { accountService } = require('../../services');
const role = require('../../appConstants/roleConstant');
const predefinedDataConstants = require('../../appConstants/predefinedDataConstants');
const { arrayShuffle } = require('../../utils/commonFunctions');
const { userNotFound } = require('../../appConstants/displayConstant');

const accountExists = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.sendStatus(400);
    }

    const exists = await accountService.checkEmailExists(email);
    return res.status(200).json({ exists });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const verifyPhone = async (req, res) => {
  try {
    const { phone_number } = req.body;
    if (!phone_number) {
      return res.sendStatus(400);
    }

    const result = await accountService.sendPhoneVerfication(phone_number);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const confirmPhone = async (req, res) => {
  try {
    const { phone_number, verification_code, verification_id } = req.body;
    if (!phone_number) {
      return res.sendStatus(400);
    }
    const result = await accountService.confirmPhoneNumber({
      phone_number,
      verification_code,
      verification_id,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const updatePhone = async (req, res) => {
  try {
    const { phone_number, verification_code, verification_id } = req.body;
    const { userId } = req.userProfile;

    if (!phone_number) {
      return res.sendStatus(400);
    }

    const result = await accountService.confirmPhoneNumber({
      phone_number,
      verification_code,
      verification_id,
    });
    if (result.phone_number) {
      const verify = await accountService.updatePhoneNumber(
        result.phone_number,
        userId,
      );
      return res.status(200).json(verify);
    }
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, phone_number, phone_verification_id } = req.body;

    if (!email || !password || !phone_number || !phone_verification_id) {
      return res.sendStatus(400);
    }

    const result = await accountService.register({
      email,
      password,
      phone_number,
      phone_verification_id,
      role: role.patient,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const result = await accountService.login({
      email,
      password,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.sendStatus(400);
    }

    const result = await accountService.verifyEmail(token);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(400);
    }

    const result = await accountService.generateAccessTokenByRefreshToken(
      token,
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const { userId } = req.userProfile;

    if (!email) {
      return res.sendStatus(400);
    }

    await accountService.sendEmail({ email, userId });

    return res.status(200).send();
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const checkForExistingPatient = async (req, res) => {
  let tenantList;
  const { firstName, lastName, dob, addressLine1, addressLine2, addressLine3 } =
    req.body;

  try {
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !addressLine1 ||
      !addressLine2 ||
      !addressLine3
    ) {
      return res.sendStatus(400);
    }

    const user = await accountService.checkExistingPatient(
      new RegExp(firstName, 'i'),
      new RegExp(lastName, 'i'),
      dob,
      new RegExp(addressLine1, 'i'),
      new RegExp(addressLine2, 'i'),
      new RegExp(addressLine3, 'i'),
    );
    if (user) {
      tenantList = await accountService.getTenantsByUserId(
        user.user_id.toString(),
      );
      return res.status(200).send({ user, tenantList });
    }
    return res.status(400).send({ user: userNotFound });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const confirmTenant = async (req, res) => {
  const { tenant_id, user_id } = req.body;
  const tenantList = [];
  try {
    if (!tenant_id || !user_id) {
      return res.status(400);
    }
    const result = await accountService.confirmTenantById(tenant_id, user_id);
    const otherTenants = await accountService.getTenantsNotByUserId(
      tenant_id,
      user_id,
    );
    predefinedDataConstants.predefinedTenantData.forEach(val => {
      if (otherTenants.length < 3) {
        otherTenants.push(val);
      }
    });
    if (result && result.length > 0) {
      tenantList.push(...result, ...otherTenants);
      const shuffledArray = await arrayShuffle(tenantList);
      return res.status(200).send({ tenantList: shuffledArray });
    }
    return res.status(400).send({ message: 'Selected Tenant is wrong' });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const confirmTenantAndGetHcp = async (req, res) => {
  const { tenant_id, user_id } = req.body;
  const hcpList = [];
  try {
    if (!tenant_id || !user_id) {
      return res.status(400);
    }
    const result = await accountService.confirmTenantById(tenant_id, user_id);
    const doctorList = await accountService.getUserHcp(tenant_id, user_id);
    predefinedDataConstants.predefinedHcpData.forEach(val => {
      if (doctorList.length < 4) {
        doctorList.push(val);
      }
    });
    if (result && result.length > 0) {
      hcpList.push(...doctorList);
      const shuffledArray = await arrayShuffle(doctorList);
      return res.status(200).send({ hcpList: shuffledArray });
    }
    return res.status(400).send({ message: 'Selected Tenant is wrong' });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const confirmHcpAndGetHcpYear = async (req, res) => {
  const { hcp_id, user_id } = req.body;
  const years = [];
  try {
    if (!hcp_id || !user_id) {
      return res.status(400);
    }
    const result = await accountService.confirmHcpById(hcp_id, user_id);
    const yearList = await accountService.getHcpYearById(hcp_id, user_id);
    predefinedDataConstants.predefinedHcpYear.forEach(val => {
      if (yearList.length < 4) {
        if (!yearList.includes(val)) {
          yearList.push(val);
        }
      }
    });
    if (result && result.length > 0) {
      years.push(...yearList);
      const shuffledArray = await arrayShuffle(years);
      return res.status(200).send({ year: shuffledArray });
    }
    return res.status(400).send({ message: 'Selected Hcp is wrong' });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const confirmHcpYearAndGetHealthCondition = async (req, res) => {
  const { hcp_id, year, user_id } = req.body;
  try {
    if (!hcp_id || !year || !user_id) {
      return res.status(400);
    }
    const result = await accountService.confirmHcpYear(hcp_id, year, user_id);
    const condition = await accountService.getHealthConditionByUserId(user_id);
    if (result) {
      const shuffledArray = await arrayShuffle(condition);
      return res.status(200).send({ condition: shuffledArray });
    }
    return res.status(400).send({ message: 'Selected year is wrong' });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const confirmHealthCondition = async (req, res) => {
  const { user_id, condition_id } = req.body;
  try {
    if (!condition_id || !user_id) {
      return res.status(400);
    }
    const result = await accountService.confirmHealthConditionByUserId(
      condition_id,
      user_id,
    );
    if (result) {
      return res.status(200).send({ condition: true });
    }
    return res.status(400).send({ message: 'Selected condition is wrong' });
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const confirmUserAccountSwapProfile = async (req, res) => {
  const { existing_user_id } = req.body;
  const { userId } = req.userProfile;

  try {
    if (!existing_user_id || !userId) {
      return res.status(400);
    }
    const result = await accountService.updateExistingUserAndDeleteNewUser(
      existing_user_id,
      userId,
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.sendStatus(400);
    }

    await accountService.forgotPassword({ email });
    return res.status(200).send({});
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  register,
  accountExists,
  verifyPhone,
  confirmPhone,
  login,
  verifyEmail,
  refreshToken,
  sendEmailVerification,
  checkForExistingPatient,
  confirmTenant,
  confirmTenantAndGetHcp,
  confirmHcpAndGetHcpYear,
  confirmHcpYearAndGetHealthCondition,
  confirmHealthCondition,
  confirmUserAccountSwapProfile,
  updatePhone,
  forgotPassword,
};
