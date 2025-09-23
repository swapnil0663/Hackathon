import { FileText, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: Plus, label: 'New Complaint', path: '/register-complaint', color: 'text-teal-500' },
    { icon: FileText, label: 'My Complaints', path: '/user-dashboard', color: 'text-indigo-500' },
    { icon: Clock, label: 'Track Status', path: '/track-complaint', color: 'text-orange-500' },
    { icon: CheckCircle, label: 'Resolved', path: '/complaint-history', color: 'text-emerald-500' },
    // { icon: AlertCircle, label: 'Urgent', path: '/urgent-complaints', color: 'text-rose-500' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 h-screen shadow-lg fixed left-0 top-19 z-10">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cyber Crime Portal</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </div>        
        <nav className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-white text-indigo-700 border border-indigo-200 shadow-md' 
                    : 'text-gray-700 hover:bg-white hover:text-gray-800 hover:shadow-md hover:border hover:border-gray-200'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600' : item.color + ' group-hover:text-gray-700'} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default UserSidebar;