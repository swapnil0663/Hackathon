import { FileText, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: Plus, label: 'New Complaint', path: '/register-complaint' },
    { icon: FileText, label: 'My Complaints', path: '/user-dashboard' },
    { icon: Clock, label: 'Track Status', path: '/track-complaint' },
    { icon: CheckCircle, label: 'Resolved', path: '/resolved-complaints' },
    { icon: AlertCircle, label: 'Urgent', path: '/urgent-complaints' },
  ];

  return (
    <div className="w-64 bg-slate-800/50 border-r border-slate-700 h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-white mb-4">User Dashboard</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default UserSidebar;