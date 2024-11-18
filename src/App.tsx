import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/organisms/AuthContext';
import LoginPage from './components/organisms/LoginPage';
import Register from './components/organisms/RegisterUser';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/organisms/PrivateRoute';
import DashboardLayout from './components/organisms/DashboardLayout';
import FeedbackForm from './components/atoms/FeedbackForm';

const App: React.FC = () => {

  return (
    <AuthProvider>
      
      <div className="font-sans">
      <Router>
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forms/feedback" element={<FeedbackForm/>} />
          
        <Route
          path="/dashboard"
          element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }/>
        </Routes>
        <ToastContainer position='top-center' />
      </Router>
      </div>
     
    </AuthProvider>
  );
};

export default App;
