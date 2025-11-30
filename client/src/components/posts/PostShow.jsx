import { useEffect, useState } from 'react';
import PostComment from './comments/PostComment.jsx';
import './PostShow.css';
import PostDelete from './PostDelete.jsx';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showThunk } from '../../store/thunks/postThunk.js';

export default function PostsShow() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.postShow);
  const { user } = useSelector(state => state.auth);
  const [openDeleteFlg, setOpenDeleteFlg] = useState(false);

  useEffect(() => {
    dispatch(showThunk(id));
  }, []);

  function openDeleteModal() {
    setOpenDeleteFlg(true);
  }
  function closeDeleteModal() {
    setOpenDeleteFlg(false);
  }

  return (
    <>
      {
        data && (
          <>
            <div className="post-show-container">
              <div className="post-show-post-box bottom-line">
                <img className="post-show-post-img" src={`${data.image}`}></img>
                <div className="post-show-post-info-items">
                  {
                    (user.id === data.userId && <div className="icon-delete" onClick={openDeleteModal} ></div>)
                    ||
                    <div></div>
                  }
                  <div className="post-show-post-likes-items">
                    <p>1919</p>
                    <div className='icon-heart-fill'></div>
                  </div>
                </div>
                <textarea className="post-show-post-constent" defaultValue={data.content}></textarea>
              </div>
              <PostComment id={id} comments={data.comments} /> 
            </div>
            {
              openDeleteFlg && <PostDelete setCloseDeleteModal={closeDeleteModal} />
            }
          </>
        )
      }
    </>
  )
}