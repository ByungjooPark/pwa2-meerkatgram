// ---------------
// Public
// ---------------
function getKakaoAuthorizeURL() {
  const params = {
    client_id: process.env.SOCIAL_KAKAO_REST_API_KEY,
    redirect_uri: `${process.env.APP_URL}${process.env.SOCIAL_KAKAO_CALLBACK_URL}`,
    response_type: 'code',
    prompt: 'login'
  };

  const queryParams = new URLSearchParams(params).toString();

  return `${process.env.SOCIAL_KAKAO_API_URL_AUTHORIZE}?${queryParams}`;
}

function getKakaoTokenRequest(code) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  };

  const params = {
    grant_type: 'authorization_code',
    client_id: process.env.SOCIAL_KAKAO_REST_API_KEY,
    redirect_uri: `${process.env.APP_URL}${process.env.SOCIAL_KAKAO_CALLBACK_URL}`,
    code: code,
  };

  const searchParams = new URLSearchParams(params);

  return { headers, searchParams };
}

function getKakaoUserRequest(token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  };

  const params = {
    secure_resource: true,
  };

  const searchParams = new URLSearchParams(params);
  return { headers, searchParams };
}

function getKakaoLogoutRequest(id, token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  };

  const params = {
    target_id_type: 'user_id',
    target_id: id
  };

  const searchParams = new URLSearchParams(params);
  return { headers, searchParams };
}

export default {
  getKakaoAuthorizeURL,
  getKakaoTokenRequest,
  getKakaoUserRequest,
  getKakaoLogoutRequest,
};