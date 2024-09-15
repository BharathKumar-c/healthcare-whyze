const { fcmService } = require('../../services');

const addToken = async (req, res) => {
  try {
    const { token } = req.body;
    const { userId } = req.userProfile;

    if (!token || !userId) {
      return res.sendStatus(400);
    }

    const result = await fcmService.addToken({
      user_id: userId,
      token,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  addToken,
};
