/**
 * @file app/utils/cookie/cookie.util.js
 * @description Cookie 유틸리티
 * 251125 v1.0.0 park init
 */

import dayjs from "dayjs";

// ----------------
// private
// ----------------
/**
 * 쿠키 셋팅
 * @param {import("express").Response} res 
 * @param {string} cookieName 
 * @param {string} cookieValue 
 * @param {number} ttl 
 * @param {boolean} httpOnlyFlg 
 * @param {boolean} secureFlg
 * @param {string|null} path
 */
function setCookie(res, cookieName, cookieValue, ttl, httpOnlyFlg = true, secureFlg = false, path = null) {
  const options = {
    expires: dayjs().add(ttl, 'second').toDate(),
    httpOnly: httpOnlyFlg,
    secure: secureFlg,
    sameSite: 'none',
  };

  if(path) {
    options.path = path;
  }

  res.cookie(cookieName, cookieValue, options);
}

/**
 * 쿠키 획득
 * @param {Request} request 
 * @param {string} cookieName 
 * @returns {string|''} tokenValue
 */
function getCookie(request, cookieName) {
    let cookieValue = '';
    
    if(request.cookies) {
        cookieValue = request.cookies[cookieName];
    }

    return cookieValue;
}

/**
 * 쿠키 제거
 * @param {import("express").Response} res
 * @param {string} cookieName
 * @param {boolean} httpOnlyFlg
 * @param {boolean} secureFlg
 * @param {string|null} path
 */
function clearCookie(res, cookieName, httpOnlyFlg = true, secureFlg = false, path = null) {
  const options = {
    httpOnly: httpOnlyFlg,
    secure: secureFlg,
    sameSite: 'none',
  };

  if(path) {
    options.path = path;
  }

  res.clearCookie(cookieName, options);
}

// ----------------
// public
// ----------------
/**
 * 쿠키에 리프래시 토큰 설정
 * @param {import("express").Response} res 
 * @param {string} refreshToken 
 */
function setCookieRefreshToken(res, refreshToken) {
  setCookie(
    res,
    process.env.JWT_REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    parseInt(process.env.JWT_REFRESH_TOKEN_COOKIE_EXPIRY),
    true,
    true,
    process.env.JWT_REISS_URI
  );
}

/**
 * 리프래시 토큰 쿠키 획득
 * @param {Request} request 
 * @returns 
 */
function getCookieRefreshToken(request) {
  return getCookie(request, process.env.JWT_REFRESH_TOKEN_COOKIE_NAME);
}

/**
 * 쿠키에 리프래시 토큰 제거
 * @param {import("express").Response} res
 */
function clearCookieRefreshToken(res) {
  clearCookie(
    res,
    process.env.JWT_REFRESH_TOKEN_COOKIE_NAME,
    true,
    true,
    process.env.JWT_REISS_URI
  );
}

export default {
  setCookieRefreshToken,
  getCookieRefreshToken,
  clearCookieRefreshToken
}