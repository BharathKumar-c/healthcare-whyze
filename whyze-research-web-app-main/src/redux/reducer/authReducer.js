import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';

const initialState = {
  isLoggedIn: loginCheck(),
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  isDisableForgot: false,
  message: '',
  userDetails: {},
  profileCount: 0,
};

function loginCheck() {
  const credentials = JSON.parse(localStorage.getItem('credentials'));
  if (credentials?.access_token) {
    const { exp } = jwt_decode(credentials.access_token);
    if (Date.now() <= exp * 1000) {
      return true;
    }
  }
  return false;
}

const authSlice = createSlice({
  name: 'authAction',
  initialState: initialState,
  reducers: {
    setLoginStatus: (state, { payload }) => {
      state.isLoggedIn = payload;
    },
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload;
    },
    setRefreshToken: (state, { payload }) => {
      state.refreshToken = payload;
    },
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setDisableForgot: (state, { payload }) => {
      state.isDisableForgot = payload;
    },
    setResetMessage: (state, { payload }) => {
      state.message = payload;
    },
    setUserDetails: (state, { payload }) => {
      state.userDetails = payload;
    },
    setProfileCount: (state) => {
      state.profileCount = state.profileCount + 1;
    },
  },
});

export const {
  setLoginStatus,
  setAccessToken,
  setRefreshToken,
  setLoading,
  setDisableForgot,
  setResetMessage,
  setUserDetails,
  setProfileCount,
} = authSlice.actions;

export default authSlice.reducer;
