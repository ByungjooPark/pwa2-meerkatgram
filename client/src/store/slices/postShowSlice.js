import { createSlice } from '@reduxjs/toolkit';
import { showThunk } from '../thunks/postThunk.js';
import { redirect } from 'react-router-dom';

const initialState = {
  data: null,
};

const postShowSlice = createSlice({
  name: 'postShow',
  initialState,
  reducers: {
    clearPostShow(state) {
      state.data = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(showThunk.fulfilled, (state, action) => {
        state.data = action.payload.data;
      })
      .addCase(showThunk.rejected, (state, action) => {
        const status = action.payload?.status;
        const data = action.payload?.response?.data;
        console.log('showThunk Error', status, data);
        alert('게시글 상세 획득에 실패했습니다.');
        redirect('/posts');
      });
  }
});

export const {
  clearPostShow,
} = postShowSlice.actions;

export default postShowSlice.reducer;
