import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { reissueThunk } from "../store/thunks/authThunk.js";
import { useEffect, useState } from "react";

const ROLE = {
  ADMIN: 'ADMIN',
  SUPER: 'SUPER',
  NORMAL: 'NORMAL'
};
const { ADMIN, NORMAL, SUPER } = ROLE;

// 인증 및 인가가 필요한 라우트만 정의
const AUTH_REQUIRED_ROUTES = [
  { path: /^\/users\/[0-9]+$/, roles: [NORMAL, SUPER] },
  { path: /^\/posts\/[0-9]+$/, roles: [NORMAL, SUPER] },
  { path: /^\/posts\/create$/, roles: [NORMAL, SUPER] },
];

// 비로그인만 허용하는 라우트 정의
const GUEST_ONLY_ROUTES = [
  /^\/login$/,
  /^\/registration$/,
];

export default function ProtectedRoute() {
  const { isLoggedIn, user, isJustLoggedOut } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // 엑세스 토큰 없을 경우, 토큰 재발급 (브라우저 새로고침 대응)
  useEffect(() => {
    async function checkAuth() {
      if(!isLoggedIn) {
        try {
          await dispatch(reissueThunk()).unwrap();
        } catch(error){
          console.log('ProtectedRoute 재발급 실패', error);
        }
      }
      setIsAuthChecked(true);
    }
    checkAuth();
  }, []);

  // 재발급 여부 체크
  if(!isAuthChecked) {
    return <div></div>;
  }

  // 게스트 라우트 확인
  const isGuestRoute = GUEST_ONLY_ROUTES.some(regx => regx.test(location.pathname));

  if(isGuestRoute) {
    if(isLoggedIn) {
      return <Navigate to="/posts" replace />;
    }
  } else {
    // 요청에 맞는 권한 규칙 조회
    const matchRole = AUTH_REQUIRED_ROUTES.find(item => item.path.test(location.pathname));
  
    // 일치하는 규칙이 있을 시, 인증 및 권한 체크를 실시
    if(matchRole && !isJustLoggedOut) {
      // 인증 체크
      if(isLoggedIn) {
        // 권한 체크
        if(matchRole.roles.includes(user.role)) {
          return <Outlet />;
        } else {
          alert('권한이 부족하여 접근할 수 없습니다.');
          return <Navigate to="/posts" replace />;
        }
      } else {
        alert('로그인이 필요한 서비스 입니다.');
        return <Navigate to="/login" replace />;
      }
    }
  }

  return <Outlet />;
}
