const jwt_decode = require('jwt-decode');

function validateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log(`No token in request`);
    return res.sendStatus(401);
  }
  const decode = jwt_decode(token);
  if (
    new Date(new Date(0).setUTCSeconds(decode.exp)) - new Date(Date.now()) >
    0
  ) {
    const userProfile = {
      emailId: decode.email,
      userId: decode.userID,
    };
    req['userProfile'] = userProfile;
    next();
  } else return res.sendStatus(408);
}

module.exports = {
  validateUser,
};
