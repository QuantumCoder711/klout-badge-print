import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import BadgePrint from './pages/print-badge';
import Login from './pages/login';

const App: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Routes>
      <Route path='/' element={<BadgePrint />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App;