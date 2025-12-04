import './App.css';
import Header from './components/common/Header.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import NotificationInfo from './components/subscriptions/NotificationInfo.jsx';

function App() {

  return (
    <>
      <Header />
      <ProtectedRoute />
      <NotificationInfo />
    </>
  )
}

export default App;
