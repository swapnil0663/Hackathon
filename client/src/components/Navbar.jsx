import { User, LogOut, LogIn, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import sessionManager from '../utils/sessionManager';
import notificationService from '../services/notificationService';
import api from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const authenticated = sessionManager.isAuthenticated();
    setIsLoggedIn(authenticated);
    
    if (authenticated) {
      notificationService.connect();
      const unsubscribe = notificationService.subscribe(setNotifications);
      
      const sampleNotifications = [
        { id: 1, message: "Complaint #CT234 has been moved to 'Under Review'", time: "2 hours ago", type: 'status_update' },
        { id: 2, message: "Investigation for Complaint #CG678 is ongoing.", time: "1 day ago", type: 'status_update' },
        { id: 3, message: "Complaint #CN012 has been resolved. Check details.", time: "3 days ago", type: 'status_update' }
      ];
      
      sampleNotifications.forEach(notification => {
        notificationService.addNotification(notification);
      });

      return () => {
        unsubscribe();
        notificationService.disconnect();
      };
    }
  }, []);
  
  const handleLogout = async () => {
    await api.logout();
    notificationService.disconnect();
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLandingPage = async () => {
    navigate('/');
  };

  const unreadCount = notifications.length;
  
  
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm fixed top-0 left-0 right-0 z-20">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer"
        onClick={handleLandingPage}>
          Complaint Track
        </div>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                            <p className="text-sm text-gray-800">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors border border-transparent hover:border-indigo-200"
              >
                <User size={20} className="text-indigo-600" />
                <span className="text-indigo-700 font-medium">Profile</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors border border-transparent hover:border-red-200"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors border border-gray-800 hover:border-indigo-200"
            >
              <LogIn size={20} />
              <span className="font-medium">Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;