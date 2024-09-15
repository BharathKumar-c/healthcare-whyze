import jwt from 'jsonwebtoken';

const JWT_CONFIG = {
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_SECRET_FOR_ACCESS_TOKEN: process.env.JWT_SECRET_FOR_ACCESS_TOKEN,
  JWT_ACCESS_TOKEN_EXPIRY_SECONDS: 60 * 60 * 1, // 1 hour

  JWT_SECRET_FOR_REFRESH_TOKEN: process.env.JWT_SECRET_FOR_REFRESH_TOKEN,
  JWT_REFRESH_TOKEN_EXPIRY_SECONDS: 60 * 60 * 24, // 24 hours,

  JWT_SECRET_FOR_RESET_PASSWORD_TOKEN:
    process.env.JWT_SECRET_FOR_RESET_PASSWORD_TOKEN,
  JWT_RESET_PASSWORD_EXPIRY_SECONDS: 60 * 60 * 1, // 1 hour
};

const getSecretToken = (type) => {
  if (type === 'access_token') {
    return {
      secret: JWT_CONFIG.JWT_SECRET_FOR_ACCESS_TOKEN,
      expiry: JWT_CONFIG.JWT_ACCESS_TOKEN_EXPIRY_SECONDS,
    };
  } else if (type === 'refresh_token') {
    return {
      secret: JWT_CONFIG.JWT_SECRET_FOR_REFRESH_TOKEN,
      expiry: JWT_CONFIG.JWT_REFRESH_TOKEN_EXPIRY_SECONDS,
    };
  } else if (type === 'reset_password') {
    return {
      secret: JWT_CONFIG.JWT_SECRET_FOR_RESET_PASSWORD_TOKEN,
      expiry: JWT_CONFIG.JWT_RESET_PASSWORD_EXPIRY_SECONDS,
    };
  }
};

const createToken = (user, type) => {
  const { secret, expiry } = getSecretToken(type);

  let payload = {
    iss: JWT_CONFIG.JWT_ISSUER,
    email: user.email,
    userID: user.userID,
  };

  // expiry - token expiry time
  return jwt.sign(payload, secret, { expiresIn: expiry });
};

const generateUserTokens = (user) => {
  try {
    const access_token = createToken(user, 'access_token');
    const refresh_token = createToken(user, 'refresh_token');
    return { access_token, refresh_token };
  } catch (error) {
    throw error;
  }
};

const verifyToken = (token, type = 'access_token') => {
  const { secret } = getSecretToken(type);

  return new Promise((resolve, reject) => {
    return jwt.verify(token, secret, async (err, payload) => {
      if (err) {
        return reject(err); // the err contains JWT error data
      }
      // this payload conatins user data
      return resolve(payload);
    });
  });
};

export default {
  createToken,
  generateUserTokens,
  verifyToken,
};
