import React, { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown, Bell, Search, Settings, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import tokenManager from '../utils/sessionManager';
import { useMessaging } from './GlobalMessaging';
import notificationService from '../services/notificationService';

const AdminNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const user = tokenManager.getUser();
  const { openMessaging } = useMessaging();

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    setNotifications(notificationService.getNotifications());
    return unsubscribe;
  }, []);

  const getUnreadCount = () => notificationService.getUnreadCount();
  const openNotifications = () => setShowNotifications(true);
  const closeNotifications = () => setShowNotifications(false);



  const handleLogout = () => {
    tokenManager.clearToken();
    navigate('/');
  };



  return (
    <motion.nav 
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 fixed top-0 left-0 right-0 z-20 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CyberGuard Portal
          </h1>
          
        </motion.div>
        
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <button
              onClick={openNotifications}
              className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors group"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              {getUnreadCount() > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-lg"
                >
                  {getUnreadCount() > 9 ? '9+' : getUnreadCount()}
                </motion.span>
              )}
            </button>


          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              openMessaging('support', 'Support Chat');
            }}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <MessageCircle className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors" />
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{user?.fullName || 'Admin'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.fullName || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@cyberguard.com'}</p>
                  </div>
                  <motion.button
                    whileHover={{ backgroundColor: '#fee2e2' }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <div 
            className="fixed inset-0 bg-black/30 z-[10000]"
            onClick={closeNotifications}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[20%] min-w-[320px] bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">Notifications</h3>
                    <p className="text-sm opacity-90">{getUnreadCount()} unread messages</p>
                  </div>
                  <button
                    onClick={closeNotifications}
                    className="p-2 hover:bg-white/20 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>
                {getUnreadCount() > 0 && (
                  <button
                    onClick={() => notificationService.markAllAsRead()}
                    className="mt-3 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        onClick={() => notificationService.markAsRead(notification.id)}
                        className={`p-4 rounded-xl cursor-pointer border-2 ${
                          !notification.read 
                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-base leading-relaxed ${
                              !notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full ml-3 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Bell className="w-20 h-20 text-gray-300 mb-4" />
                    <h4 className="text-xl font-medium text-gray-600 mb-2">No notifications</h4>
                    <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default AdminNavbar;