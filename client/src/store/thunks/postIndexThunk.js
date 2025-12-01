import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const postIndexThunk = createAsyncThunk(
  'postIndex/postIndexThunk', // Thunk 고유명
  async (page, { rejectWithValue }) => {
    try {
      const url = '/api/posts';
      const params = { page };

      const response = await axiosInstance.get(url, { params });

      return response.data;
    } catch(error) {
      return rejectWithValue(error);
    }
  }
);