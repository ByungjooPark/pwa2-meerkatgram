/**
 * @file app/services/auth.service.js
 * @description auth Service
 * 251120 park init
 */

import bcrypt from 'bcrypt';
import userRepository from "../repositories/user.repository.js";
import myError from '../errors/customs/my.error.js';
import { NOT_REGISTERED_ERROR, REISSUE_ERROR } from '../../configs/responseCode.config.js';
import jwtUtil from '../utils/jwt/jwt.util.js';
import db from '../models/index.js';
import axios from 'axios';
import socialUtil from '../utils/social/social.util.js';
import PROVIDER from '../middlewares/auth/configs/provider.enum.js';
import ROLE from '../middlewares/auth/configs/role.enum.js';

/**
 * 로그인
 * @param {{emali: string, password: string}}} body 
 * @returns {Promise<import("../models/User.js").User>}
 */
async function login(body) {
  // 트랜잭션 처리
  // return await db.sequelize.transaction(async t => {
  //   // 비지니스 로직 작성...
  // });

  // 트랜잭션 처리
  return await db.sequelize.transaction(async t => {
    const { email, password } = body;
  
    // email로 유저 정보 획득
    const user = await userRepository.findByEmail(t, email);
  
    // 유저 존재 여부 체크
    if(!user) {
      throw myError('유저 미존재', NOT_REGISTERED_ERROR);
    }
  
    // 비밀번호 체크
    if(!bcrypt.compareSync(password, user.password)) {
      throw myError('비밀번호 틀림', NOT_REGISTERED_ERROR);
    }
  
    // JWT 생성(accessToken, refreshToken)
    const accessToken = jwtUtil.generateAccessToken(user);
    const refreshToken = jwtUtil.generateRefreshToken(user);
  
    // refreshToken 저장
    user.refreshToken = refreshToken;
    await userRepository.save(t, user);
  
    return {
      accessToken,
      refreshToken,
      user
    }
  });
}

async function logout(id) {
  return await db.sequelize.transaction(async t => {
    return await userRepository.logout(t, id);
  });
}


async function reissue(token) {
  // 유저 id 획득
  const claims = jwtUtil.getClaimsWithVerifyToken(token);
  const userId = claims.sub;

  return await db.sequelize.transaction(async t => {
    // 유저정보 획득
    const user = await userRepository.findByPk(t, userId);

    // 리프래시 토큰 확인
    if(token !== user.refreshToken) {
      throw myError('리프래시 토큰 다름', REISSUE_ERROR)
    }
  
    // JWT 생성
    const accessToken = jwtUtil.generateAccessToken(user);
    const refreshToken = jwtUtil.generateRefreshToken(user);
  
    // RefreshToken 저장
    user.refreshToken = refreshToken;
    await userRepository.save(t, user);

    return {
      accessToken,
      refreshToken,
      user
    };
  });
}

async function socialKakao(code) {
  const tokenRequest = socialUtil.getKakaoTokenRequest(code);
  
  // 토큰 획득
  const resultToken = await axios.post(process.env.SOCIAL_KAKAO_API_URL_TOKEN, tokenRequest.searchParams, { headers: tokenRequest.headers });
  const { access_token } = resultToken.data;

  // 유저정보 획득
  const userRequest = socialUtil.getKakaoUserRequest(access_token);
  const resultUser = await axios.post(process.env.SOCIAL_KAKAO_API_URL_USER_INFO, userRequest.searchParams, { headers: userRequest.headers });

  const kakaoId = resultUser.data.id;
  const email = resultUser.data.kakao_account.email;
  const profile = resultUser.data.kakao_account.profile.thumbnail_image_url;
  const nick = resultUser.data.kakao_account.profile.nickname;

  const refreshToken = db.sequelize.transaction(async t => {
    // 회원 체크
    let user = await userRepository.findByEmail(t, email);
  
    // 비가입 회원인경우 회원 가입 처리
    if(!user) {
      const data = {
        email,
        profile,
        nick,
        password: bcrypt.hashSync(crypto.randomUUID(), 10),
        provider: PROVIDER.KAKAO,
        role: ROLE.NORMAL,
      }
  
      user = await userRepository.create(t, data)
    } else {
      // 프로바이터 확인 후 카카오 아니면 변경
      if(user.provider !== PROVIDER.KAKAO) {
        user.provider = PROVIDER.KAKAO;
      }
    }
    
    // RefreshToken 생성
    const refreshToken = jwtUtil.generateRefreshToken(user);
  
    // RefreshToken 저장
    user.refreshToken = refreshToken;
    await userRepository.save(t, user);

    return refreshToken;
  });

  // 카카오 로그아웃 처리
  const logoutRequest = socialUtil.getKakaoLogoutRequest(kakaoId, access_token);
  const resultLogout = await axios.post(process.env.SOCIAL_KAKAO_API_URL_LOGOUT, logoutRequest.searchParams, { headers: logoutRequest.headers });
  console.log(resultLogout);
  return refreshToken;
}

export default {
  login,
  logout,
  reissue,
  socialKakao,
}