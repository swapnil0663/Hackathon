import React, { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tokenManager from '../utils/sessionManager';
import notificationService from '../services/notificationService';

const AdminNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const user = tokenManager.getUser();

  useEffect(() => {
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
  }, []);

  const handleLogout = () => {
    tokenManager.clearToken();
    navigate('/login');
  };

  const unreadCount = notifications.length;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">Complaint Track Management</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 text-gray-600" />
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

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.fullName || 'Admin'}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;