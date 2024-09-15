const { AuthService } = require('../service');

const register = async (req, responseCallback) => {
  try {
    const reqBody = JSON.parse(req.body);

    const { email, phone, countryCode, password } = reqBody;

    if (!email || !phone || !countryCode || !password) {
      return responseCallback({
        statusCode: 400,
        body: {
          message: 'One or more required fields are missing',
        },
      });
    }
    const isExist = await AuthService.isEmailExist(email);
    if (isExist) {
      return responseCallback({
        statusCode: 400,
        body: {
          message: 'Email already exist',
        },
      });
    }

    const result = await AuthService.createUser({
      email,
      phone,
      countryCode,
      password,
    });

    return responseCallback({
      statusCode: 200,
      body: result,
    });
  } catch (error) {
    console.log(error);
    return responseCallback({
      statusCode: 500,
    });
  }
};

const login = async (req, responseCallback) => {
  try {
    const reqBody = JSON.parse(req.body);
    console.log({ reqBodyLogin: reqBody });
    const { email, password } = reqBody;

    if (!email || !password) {
      return responseCallback({
        statusCode: 400,
        body: {
          message: 'One or more required fields are missing',
        },
      });
    }

    const result = await AuthService.login({ email, password });
    if (result) {
      return responseCallback({
        statusCode: 200,
        body: result,
      });
    } else {
      return responseCallback({
        statusCode: 400,
        body: {
          message: 'Invalid Credentials',
        },
      });
    }
  } catch (error) {
    console.log(error);
    return responseCallback({
      statusCode: 500,
    });
  }
};

const refreshToken = async (req, responseCallback) => {
  const REFRESH_TOKEN = req.headers['authorization']?.toString();

  if (!REFRESH_TOKEN) {
    return responseCallback({
      statusCode: 400,
      body: {
        message: 'refresh_token header is required',
      },
    });
  }

  try {
    const result = await AuthService.generateAccessTokenByRefreshToken(
      REFRESH_TOKEN,
    );
    return responseCallback({
      statusCode: 200,
      body: result,
    });
  } catch (error) {
    return responseCallback({
      statusCode: 401,
      body: {
        message: error?.message || '',
      },
    });
  }
};

const sendResetPasswordLink = async (req, responseCallback) => {
  try {
    const reqBody = JSON.parse(req.body);

    const { email } = reqBody;

    if (!email) {
      return responseCallback({
        statusCode: 400,
        body: {
          message: 'Email is required',
        },
      });
    }

    const { Item } = await AuthService.findByEmail(email);
    const message =
      'You will receive a password recovery link at your email address in a few minutes If your email address exists in our system.';

    if (!Item) {
      return responseCallback({
        statusCode: 200,
        body: {
          message,
        },
      });
    }

    await AuthService.sendResetPasswordLinkToEmail(Item);

    return responseCallback({
      statusCode: 200,
      body: {
        message,
      },
    });
  } catch (error) {
    console.log(error);
    return responseCallback({
      statusCode: 500,
    });
  }
};

const resetPassword = async (req, responseCallback) => {
  try {
    const reqBody = JSON.parse(req.body);

    const { password, token } = reqBody;

    if (!password) {
      return responseCallback({
        statusCode: 400,
        body: {
          message: 'password is required',
        },
      });
    }

    await AuthService.resetPassword({ password, token });
    return responseCallback({
      statusCode: 200,
    });
  } catch (error) {
    return responseCallback({
      statusCode: error?.message ? 400 : 500,
      body: {
        message: error?.message || '',
      },
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  sendResetPasswordLink,
  resetPassword,
};
