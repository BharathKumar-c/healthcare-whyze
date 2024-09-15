/* eslint-disable no-param-reassign */
require('dotenv').config();
require('./config/DB');
const moment = require('moment');
const { User } = require('./models');
const fcmService = require('./services/fcmService');
const { timeRoundOff } = require('./utils/dateUtils');
const {
  remainderNotification,
} = require('./appConstants/notificationConstant');
const patientService = require('./services/patientService');

async function sendNotifications() {
  try {
    const currentDate = moment();
    const exactMoment = currentDate
      .clone()
      .startOf('minute')
      .seconds(0)
      .milliseconds(0);

    console.log(`sendNotifications running ${currentDate}`);

    const users = await User.find({
      next_notification_time: exactMoment.toDate(),
      notification_sent_count: { $lte: 2, $ne: null },
    });

    await Promise.all(
      users.map(async user => {
        await fcmService.sendPushNotificationByUserID({
          user_id: user._id,
          ...remainderNotification,
        });

        if (user.notification_sent_count === 0) {
          const newNotificationTime = timeRoundOff(72, 15, user.created_on);
          user.notification_sent_count = 1;
          user.next_notification_time = newNotificationTime;
        } else if (user.notification_sent_count === 1) {
          const newNotificationTime = timeRoundOff(120, 15, user.created_on);
          user.notification_sent_count = 2;
          user.next_notification_time = newNotificationTime;
        }

        await user.save();
      }),
    );
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}
async function sendLinkedAccountInvitation() {
  try {
    const currentDate = moment();
    const exactMoment = currentDate
      .clone()
      .startOf('day')
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);

    console.log(`LinkedAccountInvitation running ${exactMoment}`);

    if (currentDate.isSame(exactMoment)) {
      await patientService.sentAccountInvitation();
    }
  } catch (error) {
    console.error('Error sending LinkedAccountInvitation:', error);
  }
}
exports.handler = async (_, _context) => {
  try {
    console.log(_context);
    await sendNotifications();
    return 'Notifications sent successfully.';
  } catch (error) {
    console.error('Error sending notifications:', error);
    throw error;
  }
};

exports.handler = async (_, _context) => {
  try {
    console.log(_context);
    await sendLinkedAccountInvitation();
    return 'LinkedAccountInvitation sent successfully.';
  } catch (error) {
    console.error('Error sending LinkedAccountInvitation:', error);
    throw error;
  }
};
