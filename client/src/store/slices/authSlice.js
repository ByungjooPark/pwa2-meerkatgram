import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, reissueThunk } from '../thunks/authThunk.js';

const initialState = {
  accessToken: null,
  user: null,
  isLoggedIn: false,
  isJustLoggedOut: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      state.user = user;
      state.isLoggedIn = true;
      state.isJustLoggedOut = false;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isLoggedIn = false;
      state.isJustLoggedOut = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload.data;
        state.accessToken = accessToken;
        state.user = user;
        state.isLoggedIn = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.accessToken = null;
        state.user = null;
        state.isLoggedIn = false;

        const status = action.payload?.status;
        const data = action.payload?.response.data;
        const errorMsg = data?.msg || '예기치 못한 에러 발생';
        console.log('loginThunk Error', status, data);
        alert(`로그인 에러: ${errorMsg}`);

      })
      .addCase(reissueThunk.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload.data;
        state.accessToken = accessToken;
        state.user = user;
        state.isLoggedIn = true;
      })
      .addCase(reissueThunk.rejected, (state, action) => {
        state.accessToken = null;
        state.user = null;
        state.isLoggedIn = false;

        const status = action.payload?.status;
        const data = action.payload?.response.data;
        console.log('reissueThunk Error', status, data);
      });
  }
});

export const {
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;
