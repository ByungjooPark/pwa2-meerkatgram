import './Header.css';
import { useLocation, useNavigate } from "react-router-dom";
import UserInfo from './UserInfo.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../../store/slices/authSlice.js';
import { logoutThunk } from '../../store/thunks/authThunk.js';

export default function Header() {
  const { isLoggedIn } = useSelector(state => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onlyTitleList = ['/login', '/registration'];
  const onlyTitleFlg = onlyTitleList.some(path => path === location.pathname);

  function redirectLogin() {
    navigate('/login');
  }
  
  function redirectRegistration() {
    navigate('/registration');
  }
  
  function redirectPosts() {
    navigate('/posts');
  }

  async function logout() {
    await dispatch(logoutThunk());
    dispatch(clearAuth());
    navigate('/posts');
  }

  return (
    <>
      <div className="header-container">
        <div className={`${(onlyTitleFlg && 'header-top') || 'bottom-line header-top-grid'}`}>
          <h1 className={`${(onlyTitleFlg && 'header-top-title-only') || ''}`} onClick={redirectPosts}>Meerkagram</h1>
          {
            !onlyTitleFlg && (
              <div className='header-top-btn-box'>
                {
                  (isLoggedIn && <button type="button" className='btn-small bg-dark' onClick={logout}>Logout</button>)
                  ||
                  <>
                    <button type="button" className='btn-small bg-gray' onClick={redirectLogin}>Sign In</button>
                    <button type="button" className='btn-small bg-light' onClick={redirectRegistration}>Sign Up</button>
                  </>
                }
              </div>
            )
          }
        </div>
        {
          isLoggedIn && <UserInfo />
        }
      </div>
    </>
  )
}
