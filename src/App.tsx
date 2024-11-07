import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/organisms/Dashboard';
import ClosedProjects from './Components/molecules/Projects/ClosedProjects';
import OpenProjects from './Components/molecules/Projects/OpenProjects';
import WriteMessage from './Components/molecules/Messages/CustomMessage';
import Preferences from './Components/molecules/ProfileSettings/Prefrences';
import ChangePassword from './Components/molecules/ProfileSettings/ChangePassword';
import UpdateUsers from './Components/molecules/ProfileSettings/UpdateUsers';
import SearchFiles from './Components/molecules/Search/SearchFiles';
import ProjectDetails from './Components/organisms/ProjectDetails';
import OrderNow from './Components/molecules/New Order/OrderNow';
import SendProposal from './Components/molecules/New Order/SendProposal';
import AllProjects from './Components/molecules/Projects/AllProjects';
import { AuthProvider } from './Components/organisms/AuthContext';
import PrivateRoute from './Components/organisms/PrivateRoute';
import SignInPage from './Components/organisms/SiignInPage';
import Register from './Components/organisms/RegisterUser';
import AddEditUsers from './Components/atoms/AddEditUser';
import AcceptInvitation from './Components/atoms/AcceptInvitation';
import ProtectedRoute from './Components/organisms/ProtectedRoute';
import SuperAdminPage from './Components/organisms/superAdmin/SuperAdminPage';
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {

  return (
    <AuthProvider>
      
      <div className="font-sans">
      <Router>
        <Routes>
        <Route path="/" element={<SignInPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin" 
          element={
            <ProtectedRoute roles={['superAdmin']}>
              <SuperAdminPage />
            </ProtectedRoute>
          } 
        />

          {/* <Route path="/superadmin/dashboard-settings" element={<DashboardSettings />} /> */}

          <Route path="/add-edit-users" element={<AddEditUsers />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />

          <Route path="/dashboard/all-projects" element={<AllProjects />} />
          <Route path="/dashboard/open-projects" element={<OpenProjects />} />
          <Route path="/dashboard/closed-projects" element={<ClosedProjects />} />
          {/* <Route path="/dashboard/subscription-management" element={<ManageSubscription />} /> */}
          {/* <Route path="/dashboard/all-messages" element={<AllMessages />} /> */}
          <Route path="/dashboard/write-message" element={<WriteMessage />} />
          <Route path="/dashboard/all-services" element={<OrderNow />} />
          <Route path="/dashboard/request-proposal" element={<SendProposal />} />
          <Route path="/dashboard/preferences" element={<Preferences />} />
          <Route path="/dashboard/change-password" element={<ChangePassword />} />
          <Route path="/dashboard/addedit-users" element={<UpdateUsers />} />
          <Route path="/dashboard/search-projects" element={<SearchFiles />} />
          {/* <Route path="/dashboard/project-details/:projectId" element={<ProjectDetails />} /> */}
        </Routes>
      </Router>
      </div>
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
