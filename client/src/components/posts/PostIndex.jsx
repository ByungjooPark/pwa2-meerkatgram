import { useDispatch, useSelector } from 'react-redux';
import './PostIndex.css';
import { useEffect } from 'react';
import { indexThunk } from '../../store/thunks/postThunk.js';
import { useNavigate } from 'react-router-dom';

export default function PostIndex() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, page } = useSelector(state => state.postIndex);

  useEffect(() => {
    if(!data) {
      dispatch(indexThunk(1));
    }
  }, []);

  function nextPage() {
    console.log(page + 1);
    dispatch(indexThunk(page + 1));
  }

  function redirectPostShow(id) {
    navigate(`/posts/show/${id}`);
  }
  return (
    <>
      <div className="post-index-container">
        <div className="post-index-card-box">
          {
            data && data.map(item => {
              return (<div className="post-index-card" style={{backgroundImage: `url("${item.image}")`}} key={item.id} onClick={() => { redirectPostShow(item.id) }}></div>)
            })
          }
        </div>
        <button type="button" className='btn-full-width bg-gray' onClick={nextPage}>Show more posts from Kanna_Kamui</button>
      </div>
    </>
  )
}