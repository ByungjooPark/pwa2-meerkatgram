import { createSlice } from '@reduxjs/toolkit';
import { indexThunk } from '../thunks/postThunk.js';

const initialState = {
  data: null,
  page: 0,
};

const postIndexSlice = createSlice({
  name: 'postIndex',
  initialState,
  reducers: {
    clearPostIndex(state) {
      state.data = null;
      state.page = 0;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(indexThunk.fulfilled, (state, action) => {
        console.log(action.payload.data);
        if(state.data) {
          state.data = [...state.data, ...action.payload.data];
        } else {
          state.data = action.payload.data;
        }
        state.page = state.page + 1;
      })
      .addCase(indexThunk.rejected, (state, action) => {
        const status = action.payload?.status;
        const data = action.payload?.response?.data;
        console.log('indexThunk Error', status, data);
        alert('게시글 획득에 실패했습니다.');
      });
  }
});

export const {
  clearPostIndex,
} = postIndexSlice.actions;

export default postIndexSlice.reducer;
