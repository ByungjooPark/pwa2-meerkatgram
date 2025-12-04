import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
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

axiosInstance.interceptors.request.use(async (config) => {
  const noRetry = /^\/api\/auth\/reissue$/;// 리트라이 제외 URL 설정
  let { accessToken } = store.getState().auth; // auth state 획득

  try {
    // 엑세스 토큰 있음 && 리트라이 제외 URL 아님
    if(accessToken && !noRetry.test(config.url)) {
      // 엑세스 토큰 만료 확인
      const claims = jwtDecode(accessToken);
      const now = dayjs().unix();
      const expTime = dayjs.unix(claims.exp).add(-5, 'minute').unix();

      if(now >= expTime) {
        const response = await store.dispatch(reissueThunk()).unwrap();
        accessToken = response.data.accessToken;
      }

      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
  
    return config;
  } catch(error) {
    console.log('axios interceptor', error);
    return Promise.reject(error);
  }
});

export default axiosInstance;
