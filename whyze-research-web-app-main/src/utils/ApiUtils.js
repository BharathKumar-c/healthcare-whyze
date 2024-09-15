import axios from 'axios';
import { localStorageKey } from '../constant';
import { authEndPoints } from '../constant/ApiEndPoints';
import {
  setAccessToken,
  setLoginStatus,
  setRefreshToken,
} from '../redux/reducer/authReducer';
import store from '../redux/store';

const getToken = () => {
  let local_credentials = JSON.parse(
    localStorage.getItem(localStorageKey.credentials),
  );
  if (local_credentials?.refresh_token && local_credentials?.access_token) {
    return {
      access_token: local_credentials?.access_token,
      token_type: 'bearer',
      refresh_token: local_credentials?.refresh_token,
    };
  }
  return {
    access_token: null,
    token_type: 'bearer',
    refresh_token: null,
  };
};

const ApiUtil = {
  getData: (url) =>
    new Promise((resolve, reject) => {
      const credentials = getToken();
      if (credentials?.access_token) {
        axios
          .get(url, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${credentials.access_token}`,
            },
          })
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error('token is not valid'));
      }
    }),
  postData: (url, data) =>
    new Promise((resolve, reject) => {
      const credentials = JSON.parse(
        localStorage.getItem('credentials') || '{}',
      );
      if (credentials?.access_token) {
        let headerObj = {
          headers: {
            authorization: `Bearer ${credentials.access_token}`,
            'Content-Type': 'application/json',
          },
        };
        axios
          .post(url, data, headerObj)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error('token is not valid'));
      }
    }),
  deleteData: (url) =>
    new Promise((resolve, reject) => {
      const credentials = JSON.parse(
        localStorage.getItem('credentials') || '{}',
      );
      if (credentials?.access_token) {
        const headerObj = {
          headers: {
            authorization: `Bearer ${credentials.access_token}`,
            'Content-Type': 'application/json',
          },
        };
        axios
          .delete(url, headerObj)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error('token is not valid'));
      }
    }),
  putData: (url, data) =>
    new Promise((resolve, reject) => {
      const credentials = JSON.parse(
        localStorage.getItem('credentials') || '{}',
      );
      if (credentials?.access_token) {
        const headerObj = {
          headers: {
            authorization: `Bearer ${credentials.access_token}`,
            'Content-Type': 'application/json',
          },
        };

        axios
          .put(url, data, headerObj)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error('token is not valid'));
      }
    }),
  patchData: (url, data) =>
    new Promise((resolve, reject) => {
      const credentials = JSON.parse(
        localStorage.getItem('credentials') || '{}',
      );
      if (credentials?.access_token) {
        const headerObj = {
          headers: {
            authorization: `Bearer ${credentials.access_token}`,
            'Content-Type': 'application/json',
          },
        };

        axios
          .patch(url, data, headerObj)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error('token is not valid'));
      }
    }),
  loginUser: (url, data) =>
    new Promise((resolve, reject) => {
      axios
        .post(authEndPoints.login, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((result) => {
          if (result && result.data) {
            localStorage.setItem(
              localStorageKey.credentials,
              JSON.stringify(result.data),
            );
            store.dispatch(setLoginStatus(true));
            store.dispatch(
              setAccessToken(JSON.stringify(result.data.access_token)),
            );
            store.dispatch(
              setRefreshToken(JSON.stringify(result.data.refresh_token)),
            );
          }
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    }),
  register: (url, data) =>
    new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((result) => {
          if (result && result.data) {
            localStorage.setItem('credentials', JSON.stringify(result.data));
          }
          resolve(result);
        })
        .catch((err) => {
          reject(err?.response?.data?.message);
        });
    }),
  forgotPassword: (url, data) =>
    new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    }),
  resetPassword: (url, data) =>
    new Promise((resolve, reject) => {
      axios
        .post(url, data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    }),
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    const originalRequest = err.config;

    console.log(err?.response);
    console.log(err?.response?.status);

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((e) => {
            return Promise.reject(e);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        const credentials = getToken();
        axios
          .get(authEndPoints.refreshToken, {
            headers: {
              authorization: `Bearer ${credentials.refresh_token}`,
              zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          })
          .then(({ data }) => {
            originalRequest.headers[
              'authorization'
            ] = `Bearer ${data.access_token}`;
            originalRequest.headers['authorization-type'] =
              credentials.token_type;
            localStorage.setItem(
              localStorageKey.credentials,
              JSON.stringify(data),
            );
            processQueue(null, data.fooToken);
            resolve(axios(originalRequest));
          })
          .catch((error) => {
            processQueue(error, null);
            localStorage.removeItem(localStorageKey.credentials);
            store.dispatch(setLoginStatus(false));
            store.dispatch(setAccessToken(null));
            store.dispatch(setRefreshToken(null));
            window.location.reload();
            reject(error);
          })
          .then(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  },
);

export default ApiUtil;
