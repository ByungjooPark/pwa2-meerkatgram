import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js';
import postIndexResucer from "./slices/postIndexSlice.js";
import postShowResucer from "./slices/postShowSlice.js";

export default configureStore({
  reducer: {
    auth: authReducer,
    postIndex: postIndexResucer,
    postShow: postShowResucer,
  }
});