const { v4: uuidv4 } = require('uuid');
const { ddbClient } = require('../ddbClient');
const bcrypt = require('bcryptjs');
const { default: JwtService } = require('./jwt.service');
const { default: SesService } = require('./ses.service');

const findByEmail = (email) => {
  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: {
      email,
    },
  };

  return ddbClient.get(params).promise();
};

const isEmailExist = async (email) => {
  const { Item } = await findByEmail(email);
  return !!Item;
};

const createUser = async ({ email, phone, countryCode, password }) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const params = {
      TableName: process.env.USER_TABLE_NAME,
      Item: {
        userID: uuidv4(),
        email: email,
        phone: phone,
        countryCode: countryCode,
        password: hashedPassword,
      },
    };
    const user = await ddbClient.put(params).promise();
    const result = JwtService.generateUserTokens(user);
    return result;
  } catch (error) {
    throw error;
  }
};

const login = async ({ email, password }) => {
  try {
    const { Item } = await findByEmail(email);
    if (!Item) throw Error('Invalid Credentials');

    const hashedPassword = Item.password;
    const isMatch = bcrypt.compareSync(password, hashedPassword);

    if (isMatch) {
      const result = JwtService.generateUserTokens(Item);
      return result;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

const generateAccessTokenByRefreshToken = async (refresh_token) => {
  try {
    const payload = await JwtService.verifyToken(
      refresh_token,
      'refresh_token',
    );
    const data = {
      email: payload?.email,
      userID: payload.userID,
    };
    const access_token = JwtService.createToken(data, 'access_token');
    return { access_token, refresh_token };
  } catch (error) {
    throw error;
  }
};

const sendResetPasswordLinkToEmail = async (user) => {
  const token = JwtService.createToken(user, 'reset_password');

  const portalLink = process.env.PORTAL_LINK;
  const forgotPasswordRoute = process.env.FORGOT_PASSWORD_ROUTE;

  const body = `<h3> Reset Password Link  </h3>
  <p> ${portalLink + forgotPasswordRoute}?token=${token}</p>
  `;

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: {
      email: user.email,
    },
    UpdateExpression: 'SET forgot_password_token = :token',
    ExpressionAttributeValues: {
      ':token': token,
    },
  };

  await ddbClient.update(params).promise();

  return SesService.sendEmail({
    to: user.email,
    subject: 'Reset password link',
    body: body,
  });
};

const resetPassword = async ({ token, password }) => {
  try {
    const payload = await JwtService.verifyToken(token, 'reset_password');
    const { Item } = await findByEmail(payload.email);

    if (Item.forgot_password_token != token) {
      throw Error('Link Expired');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const params = {
      TableName: process.env.USER_TABLE_NAME,
      Key: {
        email: payload.email,
      },
      UpdateExpression:
        'SET password = :password, forgot_password_token = :token',
      ExpressionAttributeValues: {
        ':password': hashedPassword,
        ':token': '',
      },
    };
    return ddbClient.update(params).promise();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  login,
  isEmailExist,
  generateAccessTokenByRefreshToken,
  findByEmail,
  sendResetPasswordLinkToEmail,
  resetPassword,
};
