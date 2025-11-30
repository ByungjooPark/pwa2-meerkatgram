import './App.css';
import Header from './components/common/Header.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <Header />
      <ProtectedRoute />
    </>
  )
}

export default App;
