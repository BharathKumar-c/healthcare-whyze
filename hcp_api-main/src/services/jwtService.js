const jwt = require('jsonwebtoken');
const util = require('util');
const {
  ACCEPT_LINK_REQUEST,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  EMAIL_VERIFICATION,
  FORGOT_PASSWORD,
  MEMBER_SHARING_ACCOUNT,
} = require('../appConstants/tokenTypeConstant');

const JWT_CONFIG = {
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_SECRET_FOR_ACCESS_TOKEN: process.env.JWT_SECRET_FOR_ACCESS_TOKEN,
  JWT_ACCESS_TOKEN_EXPIRY_SECONDS: 60 * 60 * 1, // 1 hour

  JWT_SECRET_FOR_REFRESH_TOKEN: process.env.JWT_SECRET_FOR_REFRESH_TOKEN,
  JWT_REFRESH_TOKEN_EXPIRY_SECONDS: 60 * 60 * 24, // 24 hours,

  JWT_SECRET_FOR_EMAIL_VERIFICATION_TOKEN:
    process.env.JWT_SECRET_FOR_EMAIL_VERIFICATION_TOKEN,
  JWT_RESET_PASSWORD_EXPIRY_SECONDS: 60 * 60 * 1, // 1 hour

  JWT_SECRET_FOR_FORGOT_PASSWORD: process.env.JWT_SECRET_FOR_FORGOT_PASSWORD,
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRY_SECONDS: 60 * 60 * 24, // 24 hours,

  JWT_SECRET_FOR_ACCEPT_LINK_REQUEST:
    process.env.JWT_SECRET_FOR_ACCEPT_LINK_REQUEST,
  JWT_ACCEPT_LINK_REQUEST_TOKEN_EXPIRY_SECONDS: 60 * 60 * 24, // 24 hours,

  JWT_SECRET_FOR_MEMBER_SHARING_ACCOUNT:
    process.env.JWT_SECRET_FOR_MEMBER_SHARING_ACCOUNT,
  JWT_SECRET_FOR_MEMBER_SHARING_ACCOUNT_TOKEN_EXPIRY_SECONDS: 60 * 60 * 24, // 24 hours,
};

const getSecretToken = type => {
  if (type === ACCESS_TOKEN) {
    return {
      secret: JWT_CONFIG.JWT_SECRET_FOR_ACCESS_TOKEN,
      expiry: JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRY_SECONDS,
    };
  }
  if (type === REFRESH_TOKEN) {
    return {
      secret: JWT_CONFIG.JWT_SECRET_FOR_REFRESH_TOKEN,
      expiry: JWT_CONFIG.JWT_REFRESH_TOKEN_EXPIRY_SECONDS,
    };
  }
  if (type === EMAIL_VERIFICATION) {
    return {
      secret: JWT_CONFIG.JWT_SECRET_FOR_EMAIL_VERIFICATION_TOKEN,
      expiry: JWT_CONFIG.JWT_RESET_PASSWORD_EXPIRY_SECONDS,
    };
  }
  if (type === FORGOT_PASSWORD) {
    return {
      secret: JWT_CONFIG.JWT_SECRET_FOR_FORGOT_PASSWORD,
      expiry: JWT_CONFIG.JWT_FORGOT_PASSWORD_TOKEN_EXPIRY_SECONDS,
    };
  }

  if (type === ACCEPT_LINK_REQUEST) {
    return {
      secret: JWT_CONFIG.JWT_SECRET_FOR_ACCEPT_LINK_REQUEST,
      expiry: JWT_CONFIG.JWT_ACCEPT_LINK_REQUEST_TOKEN_EXPIRY_SECONDS,
    };
  }

  if (type === MEMBER_SHARING_ACCOUNT) {
    return {
      secret: JWT_CONFIG.JWT_SECRET_FOR_MEMBER_SHARING_ACCOUNT,
      expiry:
        JWT_CONFIG.JWT_SECRET_FOR_MEMBER_SHARING_ACCOUNT_TOKEN_EXPIRY_SECONDS,
    };
  }

  throw Error('Invalid Token Type');
};

const createToken = (user, type) => {
  const { secret, expiry } = getSecretToken(type);

  const payload = {
    iss: JWT_CONFIG.JWT_ISSUER,
    email: user.email,
    user_id: user.user_id,
    role: user.role,
    patient_id: user.patient_detail,
    admin_id: user.admin_id,
  };

  // expiry - token expiry time
  return jwt.sign(payload, secret, { expiresIn: expiry });
};

const generateUserTokens = async user => {
  const access_token = createToken(user, ACCESS_TOKEN);
  const refresh_token = createToken(user, REFRESH_TOKEN);
  return { access_token, refresh_token };
};

const verifyToken = (token, type = ACCESS_TOKEN) => {
  const { secret } = getSecretToken(type);
  const verify = util.promisify(jwt.verify);

  return verify(token, secret);
};

module.exports = {
  createToken,
  generateUserTokens,
  verifyToken,
};
