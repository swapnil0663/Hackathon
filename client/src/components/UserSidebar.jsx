import { FileText, Plus, Clock, CheckCircle, AlertCircle, Shield, Activity } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: Plus, label: 'New Complaint', path: '/register-complaint', color: 'text-teal-500' },
    { icon: FileText, label: 'My Complaints', path: '/user-dashboard', color: 'text-indigo-500' },
    { icon: Clock, label: 'Track Status', path: '/user/complaints', color: 'text-orange-500' },
    { icon: CheckCircle, label: 'Resolved', path: '/complaint-history', color: 'text-emerald-500' },
    // { icon: AlertCircle, label: 'Urgent', path: '/urgent-complaints', color: 'text-rose-500' },
  ];

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 h-screen shadow-2xl fixed left-0 top-19 z-10"
    >
      <div className="p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
        </motion.div>        
        
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/20' : 'bg-slate-700 group-hover:bg-slate-600'
                  }`}>
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-300'} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="userActiveIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-300">Portal Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Secure Connection</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserSidebar;