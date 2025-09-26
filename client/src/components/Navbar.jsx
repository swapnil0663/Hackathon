import { User, LogOut, LogIn, Bell, Search, Shield, LayoutDashboard, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sessionManager from '../utils/sessionManager';
import api from '../services/api';
import { useMessaging } from './GlobalMessaging';
import { useNotifications } from './GlobalNotifications';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [user, setUser] = useState(null);
  const { openMessaging } = useMessaging();
  const { openNotifications, getUnreadCount } = useNotifications();
  
  useEffect(() => {
    const authenticated = sessionManager.isAuthenticated();
    setIsLoggedIn(authenticated);
    
    if (authenticated) {
      const userData = sessionManager.getUser();
      setUser(userData);
      
      if (userData?.id) {
        fetchUserImage(userData.id);
      }
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
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLandingPage = async () => {
    navigate('/');
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
                  onClick={openNotifications}
                  className="relative p-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors group"
                >
                  <Bell size={20} className="group-hover:text-blue-700" />
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
                onClick={() => openMessaging()}
                className="p-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors group"
              >
                <MessageCircle size={20} className="group-hover:text-blue-700" />
              </motion.button>

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