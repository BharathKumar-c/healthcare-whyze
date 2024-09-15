const moment = require('moment');
const swagger = require('../swagger');

const role = require('../appConstants/roleConstant');
const { verifyToken } = require('../services/jwtService');

async function validatePatient(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token in request');
    return res.sendStatus(401);
  }
  try {
    const decode = await verifyToken(token);

    if (
      decode.role === role.patient &&
      new Date(new Date(0).setUTCSeconds(decode.exp)) - new Date(Date.now()) > 0
    ) {
      const userProfile = {
        emailId: decode.email,
        userId: decode.user_id,
        role: decode.role,
        patientId: decode.patient_id,
        adminId: decode.admin_id,
      };
      req.userProfile = userProfile;
      next();
    } else return res.sendStatus(408);
  } catch (error) {
    return res.sendStatus(401);
  }
}

/*
This middleware to validate the body.
If request contain any extra property
other than mentioned in swagger
*/

const validateBodyData = (req, res, next) => {
  if (['GET', 'DELETE'].includes(req.method)) {
    next();
  } else {
    try {
      let path = req.baseUrl;
      const obj = req.params;
      if (Object.keys(obj).length > 0) {
        let str = req.url;
        Object.keys(obj).forEach(key => {
          str = str.replace(obj[key], `{${key}}`);
        });
        path = `${path}${str}`;
      }

      const modelRef =
        swagger.definitions[
          swagger.paths[path][req.method.toLocaleLowerCase()].reference
        ].properties;
      if (
        Object.keys(req.body).filter(x => !Object.keys(modelRef).includes(x))
          .length === 0
      ) {
        next();
      } else {
        return res.sendStatus(405);
      }
    } catch (error) {
      console.log('Error at validateBodyData middleware:', error);
      return res.sendStatus(405);
    }
  }
};

async function validateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token in request');
    return res.sendStatus(401);
  }
  try {
    const decode = await verifyToken(token);

    if (
      decode.role === role.whyzeAdmin &&
      new Date(new Date(0).setUTCSeconds(decode.exp)) - new Date(Date.now()) > 0
    ) {
      const userProfile = {
        emailId: decode.email,
        userId: decode.user_id,
        role: decode.role,
      };
      req.userProfile = userProfile;
      next();
    } else return res.sendStatus(408);
  } catch (error) {
    return res.sendStatus(401);
  }
}

async function validateHcp(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token in request');
    return res.sendStatus(401);
  }
  try {
    const decode = await verifyToken(token);

    if (
      decode.role === role.primaryInvestigator &&
      new Date(new Date(0).setUTCSeconds(decode.exp)) - new Date(Date.now()) > 0
    ) {
      const userProfile = {
        emailId: decode.email,
        userId: decode.user_id,
        role: decode.role,
      };
      req.userProfile = userProfile;
      next();
    } else return res.sendStatus(408);
  } catch (error) {
    return res.sendStatus(401);
  }
}

async function validateResearchUser(req, res, next) {
  const { secret_key } = req.headers;
  if (!secret_key) {
    console.log('No secret key in request');
    return res.sendStatus(401);
  }

  try {
    if (secret_key === process.env.RESEARCH_SECRET_KEY) {
      next();
    } else {
      return res.sendStatus(408);
    }
  } catch (error) {
    return res.sendStatus(401);
  }
}

const STWM = (req, res, next) => {
  if (process.env.SERVER_ENV !== 'dev_local') {
    // gmt
    const targetDate = moment()
      .year(2024)
      .month(0) // Months are zero-based in Moment.js, so June is represented as 5
      .date(13)
      .hours(0)
      .minutes(0)
      .seconds(0);

    const currentDate = moment();

    if (currentDate > targetDate) {
      return res.sendStatus(503);
    }
    next();
  } else {
    next();
  }
};

module.exports = {
  validatePatient,
  validateBodyData,
  STWM,
  validateAdmin,
  validateHcp,
  validateResearchUser,
};
