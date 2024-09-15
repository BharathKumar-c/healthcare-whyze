const { response } = require('express');
const admin = require('firebase-admin');
const FIREBASE_CONFIG = require('../config/FIREBASE.json');
const { FcmToken } = require('../models');
const fcmToken = require('../models/fcmToken');

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CONFIG),
});

function convertNestedObjectsToStrings(obj) {
  const newObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      newObj[key] = JSON.stringify(convertNestedObjectsToStrings(value));
    } else {
      newObj[key] = value;
    }
  });
  return newObj;
}

const sendPushNotification = async ({
  data = {},
  title,
  body,
  tokens = [],
}) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data: convertNestedObjectsToStrings(data),
      tokens,
    };

    await admin.messaging().sendMulticast(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.log('Error sending message:', error);
    throw error;
  }
};

const addToken = ({ token, user_id }) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      const result = await FcmToken.create({ token, user_id });
      resolve(result);
    } catch (error) {
      if (error.code === 11000) {
        // already exist
        resolve();
      } else {
        console.log('Error in creating FCM token', error);
        reject(error);
      }
    }
  });

const getTokensByUserId = async user_id => {
  try {
    const tokens = await fcmToken.find({ user_id }, 'token');
    return tokens.map(({ token }) => token);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sendPushNotificationByUserID = async ({ user_id, title, body, data }) => {
  try {
    const tokens = await getTokensByUserId(user_id);
    if (tokens.length !== 0) {
      return sendPushNotification({ title, body, data, tokens });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  sendPushNotification,
  addToken,
  getTokensByUserId,
  sendPushNotificationByUserID,
};
