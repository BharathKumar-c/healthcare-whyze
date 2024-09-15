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

module.exports = {
  validatePatient,
  validateBodyData,
};
