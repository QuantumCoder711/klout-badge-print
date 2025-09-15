import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import BadgePrint from './pages/print-badge';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import RootLayout from './pages/layout';
import PrintName from './pages/print-name';
import PrintBadgeSquare from './pages/print-badge-square';
import PrintBadgeCombined from './pages/print-badge-combined';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/print-badge/rectangle/:eventUuid/:tabId" element={
          <ProtectedRoute>
            <BadgePrint />
          </ProtectedRoute>
        } />
        
        <Route path="/print-badge/square/:eventUuid/:tabId" element={
          <ProtectedRoute>
            <PrintBadgeSquare />
          </ProtectedRoute>
        } />
        
        <Route path="/print-badge/combined/:eventUuid/:tabId" element={
          <ProtectedRoute>
            <PrintBadgeCombined />
          </ProtectedRoute>
        } />
        
        <Route path="/print-name/:eventUuid/:tabId" element={
          <ProtectedRoute>
            <PrintName />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Redirect any unknown paths to / */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;