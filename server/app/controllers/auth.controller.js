/**
 * @file app/controllers/auth.controller.js
 * @description 인증 관련 컨트롤러
 * 251119 v1.0.0 park init
 */

import { REISSUE_ERROR, SUCCESS } from "../../configs/responseCode.config.js";
import myError from "../errors/customs/my.error.js";
import PROVIDER from "../middlewares/auth/configs/provider.enum.js";
import authService from "../services/auth.service.js";
import cookieUtil from "../utils/cookie/cookie.util.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";
import socialUtil from "../utils/social/social.util.js";

// ----------------
// ---- public ----
// ----------------
/**
 * 로그인 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체 
 * @returns
 */
async function login(req, res, next) {
  try {
    const body = req.body; // 파라미터 획득
    
    // 로그인 서비스 호출
    const { accessToken, refreshToken, user } = await authService.login(body);

    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, {accessToken, user}));
  } catch(error) {
    next(error);
  }
}

/**
 * 로그아웃 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체 
 * @returns
 */
async function logout(req, res, next) {
  try {
    const id = req.user.id;
    
    await authService.logout(id);

    // Cookie에 RefreshToken 설정
    cookieUtil.clearCookieRefreshToken(res);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS));
  } catch(error) {
    next(error);
  }
}

/**
 * 토큰 재발급 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFunction 객체 
 * @returns
 */
async function reissue(request, response, next) {
  try {
    const token = cookieUtil.getCookieRefreshToken(request);
    console.log(request.cookies);
    // 리프래시 토큰 존재 여부 채크
    if(!token) {
      throw myError('리프래시 토큰 없음', REISSUE_ERROR)
    }

    // 리프래시 토큰 획득
    const { accessToken, refreshToken, user } = await authService.reissue(token);

    // 쿠키에 리프래시토큰 설정
    cookieUtil.setCookieRefreshToken(response, refreshToken);

    return response
      .status(SUCCESS.status)
      .send(createBaseResponse(SUCCESS, {accessToken, user}));
  } catch(e) {
    next(e);
  }
}

async function social(req, res, next) {
  try {
    const provider = req.params.provider.toUpperCase();
    let url = '';

    switch (provider) {
      case PROVIDER.KAKAO:
        url = socialUtil.getKakaoAuthorizeURL();
        break;
    }

    return res.redirect(url);
  } catch(error) {
    return next(error);
  }
}

async function socialCallback(req, res, next) {
  try {
    const provider = req.params.provider.toUpperCase();
    const code = req.query?.code;
    let refreshToken = null;

    switch (provider) {
      case PROVIDER.KAKAO:
        refreshToken = await authService.socialKakao(code);
        break;
    }
    
    // Cookie에 RefreshToken 설정
    cookieUtil.setCookieRefreshToken(res, refreshToken);

    return res.redirect(`${process.env.SOCIAL_CLIENT_CALLBACK_URL}`);
    // return res.redirect(`${process.env.APP_URL}${process.env.SOCIAL_CLIENT_CALLBACK_URL}`);
  } catch (error) {
    return next(error);
  }
}

// --------------
// export
// --------------
export default {
  login,
  logout,
  reissue,
  social,
  socialCallback,
};