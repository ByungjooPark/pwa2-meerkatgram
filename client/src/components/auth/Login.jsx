import { useDispatch } from 'react-redux'
import './Login.css'
import { useState } from 'react';
import { loginThunk } from '../../store/thunks/authThunk.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 로그인 폼 핸들러
  async function handleLogin(e) {
    e.preventDefault();
    const result = await dispatch(loginThunk({email, password}));
    
    if(result.type.endsWith('/fulfilled')) {
      return navigate('/posts', { replace: true });
    }
    return;
  }

  // 소셜 로그인
  function handleSocial(e) {
    e.preventDefault();

    window.location.replace(`/api/auth/social/kakao`);
  }
  return (
    <>
      <form className="login-container" onSubmit={handleLogin}>
        <input type="text" className='input-big-border' onChange={e => setEmail(e.target.value)} placeholder='email' />
        <input type="password" className='input-big-border' onChange={e => setPassword(e.target.value)} placeholder='password' />
        <button type="submit" className="btn-big bg-gray">Log in</button>
        <div className="text-on-line">or</div>
        <button type="button" className="btn-big bg-img-kakao" onClick={handleSocial}></button>
        <button type="button" className="btn-big bg-light">Sign up</button>
      </form>
    </>
  )
}
