import { createRoot } from 'react-dom/client';
import './index.css';
import Router from './routes/Router.jsx';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { injectStroeInAxios } from './api/axiosInstance.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router />
  </Provider>
)

// axiosInstance에 store 주입
injectStroeInAxios(store);