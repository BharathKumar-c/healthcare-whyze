const { response } = require('express');
const admin = require('firebase-admin');
const FIREBASE_CONFIG = require('../config/FIREBASE.json');
const { FcmToken } = require('../models');
const fcmToken = require('../models/fcmToken');

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CONFIG),
});

const sendPushNotification = async ({ title, body, tokens = [] }) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
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

const addToken = async ({ token, user_id }) => {
  try {
    const result = await FcmToken.create({ token, user_id });
    return result;
  } catch (error) {
    console.log('Error in creating FCM token', error);
    throw error;
  }
};

const getTokensByUserId = async user_id => {
  try {
    const tokens = await fcmToken.find({ user_id }, 'token');
    return tokens.map(({ token }) => token);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  sendPushNotification,
  addToken,
  getTokensByUserId,
};
