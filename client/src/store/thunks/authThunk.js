import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance.js';

export const loginThunk = createAsyncThunk(
  'auth/loginThunk', // Thunk 고유명
  async(args, {rejectWithValue}) => {
    try {
      const url = '/api/auth/login';
      const { email, password } = args;
  
      const response = await axios.post(url, { email, password });
  
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const reissueThunk = createAsyncThunk(
  'auth/reissuThunk', // Thunk 고유명
  async(_, {rejectWithValue}) => {
    try {
      const url = '/api/auth/reissue';
  
      const response = await axios.post(url);
      console.log(`리이슈`, response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);