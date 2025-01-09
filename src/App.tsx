import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import BadgePrint from './pages/print-badge';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import RootLayout from './pages/layout';
import PrintName from './pages/print-name';
import PrintBadgeSquare from './pages/print-badge-square';

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
        <Route path='/print-badge/rectangle/:eventUuid/:tabId' element={<BadgePrint />} />
        <Route path='/print-badge/square/:eventUuid/:tabId' element={<PrintBadgeSquare />} />
        <Route path='/print-name/:eventUuid/:tabId' element={<PrintName />} />
      </Route>
    </Routes>
  )
}

export default App;