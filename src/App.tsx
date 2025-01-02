import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import BadgePrint from './pages/print-badge';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import RootLayout from './pages/layout';

const App: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route element={<RootLayout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/print-badge/:eventUuid' element={<BadgePrint />} />
      </Route>
    </Routes>
  )
}

export default App;