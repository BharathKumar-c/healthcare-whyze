const { fcmService } = require('../../services');

const addToken = async (req, res) => {
  try {
    const { token } = req.body;
    const { userId } = req.userProfile;

    if (!token || !userId) {
      return res.sendStatus(400);
    }

    await fcmService.addToken({
      user_id: userId,
      token,
    });

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

const sendPushNotification = async (req, res) => {
  try {
    const { userId } = req.userProfile;
    const { title, body, data } = req.body;

    if (!title || !userId) {
      return res.sendStatus(400);
    }

    await fcmService.sendPushNotificationByUserID({
      user_id: userId,
      title,
      body,
      data,
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ message: error?.message || '' });
  }
};

module.exports = {
  addToken,
  sendPushNotification,
};
