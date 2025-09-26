import { User, LogOut, LogIn, Bell, Search, Shield, LayoutDashboard, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sessionManager from '../utils/sessionManager';
import notificationService from '../services/notificationService';
import api from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const authenticated = sessionManager.isAuthenticated();
    setIsLoggedIn(authenticated);
    
    if (authenticated) {
      const userData = sessionManager.getUser();
      setUser(userData);
      
      if (userData?.id) {
        fetchUserImage(userData.id);
      }
      
      notificationService.connect();
      const unsubscribe = notificationService.subscribe(setNotifications);
      setNotifications(notificationService.getNotifications());

      return () => {
        unsubscribe();
        notificationService.disconnect();
      };
    }
  }, []);
  
  const fetchUserImage = async (userId) => {
    try {
      const imageData = await api.getUserImage(userId);
      if (imageData) {
        setUserImage(`http://localhost:5000/${imageData.image_path}`);
      }
    } catch (error) {
      console.log('No profile image found for user');
    }
  };
  
  const handleLogout = async () => {
    await api.logout();
    notificationService.disconnect();
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLandingPage = async () => {
    navigate('/');
  };

  const unreadCount = notificationService.getUnreadCount();

  const handleNotificationClick = (notification) => {
    notificationService.markAsRead(notification.id);
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
  };
  
  
  return (
    <motion.nav 
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 shadow-lg fixed top-0 left-0 right-0 z-20"
    >
      <div className="flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleLandingPage}>
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CyberGuard
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Complaint Portal</p>
            </div>
          </div>
          
          {/* {isLoggedIn && (
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 ml-6">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search your complaints..."
                className="bg-transparent text-sm outline-none w-48"
              />
            </div>
          )} */}
        </motion.div>
        
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <motion.div 
                className="relative"
              >
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors group"
                >
                  <Bell size={20} className="group-hover:text-blue-700" />
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-lg"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </button>

                {showNotifications && (
                  <div 
                    className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
                    onClick={() => setShowNotifications(false)}
                  >
                    <div 
                      className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-auto"
                      onClick={(e) => e.stopPropagation()}
                      style={{ position: 'relative', top: '0', left: '0', transform: 'none' }}
                    >
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-bold">Notifications</h3>
                            <p className="text-sm opacity-90">{unreadCount} unread messages</p>
                          </div>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="p-2 hover:bg-white/20 rounded-lg"
                          >
                            <X size={24} />
                          </button>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
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
                                onClick={() => handleNotificationClick(notification)}
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
                            <Bell className="w-20 h-20 text-gray-300 " />
                            <h4 className="text-xl font-medium text-gray-600 mb-2">No notifications</h4>
                            <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-colors"
                >
                  {userImage ? (
                    <img 
                      src={userImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      <button
                        onClick={() => {
                          navigate('/user-dashboard');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-blue-600" />
                        <span className="text-gray-700 font-medium">Go to Dashboard</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 transition-all duration-200 border border-red-200"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </motion.button>
            </>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogIn size={18} />
              <span className="font-semibold">Sign In</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;