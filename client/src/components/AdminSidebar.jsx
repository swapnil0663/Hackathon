import React from 'react';
import { BarChart3, FileText, Users, Shield, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = ({ activeItem = 'Dashboard', onItemClick }) => {
  const menuItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Complaint Management', icon: FileText },
    { name: 'Officer Profiles', icon: Users }
  ];

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 h-screen fixed left-0 top-22 z-10 shadow-2xl"
    >
      
      <nav className="mt-2 px-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                onClick={() => onItemClick(item.name)}
                className={`flex items-center px-4 py-3 mb-2 text-sm cursor-pointer rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-lg mr-3 transition-colors ${
                  isActive ? 'bg-white/20' : 'bg-slate-700 group-hover:bg-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-300">System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">All Systems Online</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;