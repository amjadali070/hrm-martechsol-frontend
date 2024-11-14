import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/organisms/AuthContext';
import LoginPage from './components/organisms/LoginPage';

const App: React.FC = () => {

  return (
    <AuthProvider>
      
      <div className="font-sans">
      <Router>
        <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" element={<Register />} /> */}
          
          {/* // <Route
          //   path="/dashboard"
          //   element={
          //     <PrivateRoute>
          //       <Dashboard />
          //     </PrivateRoute>
          //   }
          // /> */}
        </Routes>
        {/* <ToastContainer position='top-center' /> */}
      </Router>
      </div>
     
    </AuthProvider>
  );
};

export default App;
