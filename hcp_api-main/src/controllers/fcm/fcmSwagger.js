module.exports = {
  paths: {
    '/patient/v2/fcm/token': {
      post: {
        tags: ['FCM'],
        summary: 'To create/update the fcm token',
        description: 'To create/update the fcm token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/postToken',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Created',
          },
          400: {
            description: 'Invalid Token',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/patient/v2/fcm/sendPushNotification': {
      post: {
        tags: ['FCM'],
        summary: 'To send push notification',
        description:
          'It will send the push notification to the given user id. This is temporarily added, it will be removed from here once we have HCP portal.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/definitions/sendMessage',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Ok',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
  },
  definitions: {
    postToken: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
      },
    },
    sendMessage: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        body: {
          type: 'string',
        },
        data: {
          type: 'object',
        },
      },
    },
  },
};
