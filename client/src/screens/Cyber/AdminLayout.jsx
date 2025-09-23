import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';
import Dashboard from './Dashboard';
import ComplaintManagement from './ComplaintManagement';
import OfficerProfile from './OfficerProfile';

const AdminLayout = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Complaint Management':
        return <ComplaintManagement />;
      case 'Officer Profiles':
        return <OfficerProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AdminNavbar />
      <div className="flex flex-1 pt-16">
        <AdminSidebar activeItem={activeItem} onItemClick={setActiveItem} />
        <div className="flex-1 overflow-auto ml-64">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;