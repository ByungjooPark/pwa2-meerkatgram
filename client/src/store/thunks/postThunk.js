import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance.js';

export const indexThunk = createAsyncThunk(
  'post/indexThunk', // Thunk 고유명
  async(page, {rejectWithValue}) => {
    try {
      const url = '/api/posts';
      const params = { page };

      const response = await axios.get(url, { params });
  
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const showThunk = createAsyncThunk(
  'post/showThunk', // Thunk 고유명
  async(id, {rejectWithValue}) => {
    try {
      const url = `/api/posts/${id}`;

      const response = await axios.get(url);
  
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const uploadFileThunk = createAsyncThunk(
  'post/uploadFileThunk', // Thunk 고유명
  async(file, {rejectWithValue}) => {
    try {
      const url = `/api/files/posts`;
      const headers = {
        'Content-Type': 'multipart/form-data'
      }
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(url, formData, { headers });
  
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const storeThunk = createAsyncThunk(
  'post/storeThunk', // Thunk 고유명
  async(data, {rejectWithValue}) => {
    try {
      const url = `/api/posts`;
      
      const response = await axios.post(url, data);
  
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);