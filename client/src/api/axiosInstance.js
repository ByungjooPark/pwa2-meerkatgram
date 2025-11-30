import axios from "axios";
import { reissueThunk } from "../store/thunks/authThunk.js";

let store = null; // store 저장용

// store 주입용 함수
export function injectStroeInAxios(_store) {
  store = _store;
}

const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState().auth;
  if (state.accessToken) {
    config.headers["Authorization"] = `Bearer ${state.accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    const noRetryList = [
      '/api/auth/reissue',
      '/api/auth/login'
    ];

    if (error.response?.status === 401 && !originalRequest._retry && !noRetryList.includes(originalRequest.url)) {
      originalRequest._retry = true;
      try {
        const response = await store.dispatch(reissueThunk()).unwrap();

        if(response.data.accessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('재발급 실패');
        }
      } catch(error) {
        return Promise.reject(error); 
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
