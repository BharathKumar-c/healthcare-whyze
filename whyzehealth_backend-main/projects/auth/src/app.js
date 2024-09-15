const { AuthController } = require('./controller');

exports.handler = function (event, context, callback) {
  try {
    const responseCallback = ({ statusCode, body = {} }) => {
      console.log('responseCallback');
      console.log(callback);
      console.log({ statusCode, body });

      const response = {
        headers: {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        statusCode: statusCode,
        body: JSON.stringify(body),
      };

      callback(undefined, response);
    };

    switch (event.httpMethod) {
      case 'GET':
        if (event.path == '/refreshToken') {
          AuthController.refreshToken(event, responseCallback);
        }
        break;
      case 'POST':
        if (event.path == '/register') {
          AuthController.register(event, responseCallback);
        } else if (event.path == '/login') {
          AuthController.login(event, responseCallback);
        } else if (event.path == '/sendResetPasswordLink') {
          AuthController.sendResetPasswordLink(event, responseCallback);
        } else if (event.path == '/resetPassword') {
          AuthController.resetPassword(event, responseCallback);
        }
        break;
    }
  } catch (e) {
    console.error(e);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 500,
      body: JSON.stringify({
        message: e.message,
        errorStack: e.stack,
      }),
    };
  }
};
