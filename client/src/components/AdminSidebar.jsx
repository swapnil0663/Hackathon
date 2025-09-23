import React from 'react';
import { BarChart3, FileText, Users } from 'lucide-react';

const AdminSidebar = ({ activeItem = 'Dashboard', onItemClick }) => {
  const menuItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Complaint Management', icon: FileText },
    { name: 'Officer Profiles', icon: Users }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-16 z-10">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Cyber Crime Portal</h2>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              onClick={() => onItemClick(item.name)}
              className={`flex items-center px-4 py-3 text-sm cursor-pointer ${
                activeItem === item.name
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;