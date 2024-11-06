// frontend/src/components/SuperAdminPage.tsx

import React from 'react';
import { useState } from 'react';
import Dashboard from '../Dashboard';
import SuperAdminProjects from './SuperAdminProjects';
import SuperAdminUsers from './SuperAdminUsers';

const SuperAdminPage: React.FC = () => {
  const [selectedSuperAdminContent, setSelectedSuperAdminContent] = useState<string>('all-users');

  const renderSuperAdminContent = () => {
    switch (selectedSuperAdminContent) {
      case 'all-users':
        return <SuperAdminUsers />;
      case 'superadmin-all-projects':
        return <SuperAdminProjects />;
      default:
        return <SuperAdminUsers />;
    }
  };

  return (
    <Dashboard>
      <div className="p-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setSelectedSuperAdminContent('all-users')}
            className={`px-4 py-2 rounded ${selectedSuperAdminContent === 'all-users' ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}
          >
            All Users
          </button>
          <button
            onClick={() => setSelectedSuperAdminContent('superadmin-all-projects')}
            className={`px-4 py-2 rounded ${selectedSuperAdminContent === 'superadmin-all-projects' ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}
          >
            All Projects
          </button>
        </div>
        {renderSuperAdminContent()}
      </div>
    </Dashboard>
  );
};

export default SuperAdminPage;