import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VerificationOfficerDashboard from './pages/VerificationOfficerDashboard';
import RegistrationOfficerDashboard from './pages/RegistrationOfficerDashboard';
import Register from './pages/Register';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        user ? (
          user.role === 'admin' ? <Navigate to="/admin" /> :
          user.role === 'citizen' ? <Navigate to="/citizen" /> :
          user.role === 'verification_officer' ? <Navigate to="/verification-officer" /> :
          <Navigate to="/registration-officer" />
        ) : <Navigate to="/login" />
      } />
      <Route path="/citizen" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <CitizenDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/verification-officer" element={
        <ProtectedRoute allowedRoles={['verification_officer']}>
          <VerificationOfficerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/registration-officer" element={
        <ProtectedRoute allowedRoles={['registration_officer']}>
          <RegistrationOfficerDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
  },
};

export default App;