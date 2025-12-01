import { useDispatch } from 'react-redux';
import './PostCreate.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { storeThunk, uploadFileThunk } from '../../store/thunks/postThunk.js';

export default function PostCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');
  const [view, setView] = useState('');

  async function handleCreste(e) {
    e.preventDefault();

    try {
      const resultUpload = await dispatch(uploadFileThunk(file)).unwrap();
      const image = resultUpload.data.path;
      const resultStore = await dispatch(storeThunk({content, image})).unwrap();
      console.log(resultStore);
      return navigate(`/posts/show/${resultStore.data.id}`, { replace: true });
    } catch(error) {
      const code = error.response?.data?.code || 'E99';
      console.log('파일 업로드 에러', error);
      return alert(`파일 업로드 에러 발생(${code})`);
    }
  }

  function changeImage(files) {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.addEventListener(
      'load',
      () => {
        setView(reader.result);
      }
    );
    setFile(files[0]);
  }
  return (
    <>
      <form className="post-create-container" onSubmit={handleCreste}>
        <textarea className='post-create-textarea' onChange={e => setContent(e.target.value)} placeholder='내용 작성'></textarea>
        <input type="file" name="profile" onChange={e => changeImage(e.target.files)} accept="image/*" />
        {
          view && <div className="post-create-image" style={{backgroundImage: `url("${view}")`}}></div>
        }
        <button type="submit" className="btn-big bg-gray">Write</button>
      </form>
    </>
  )
}