import React, { useState, createContext, useContext, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationService.connect();
    const unsubscribe = notificationService.subscribe(setNotifications);
    setNotifications(notificationService.getNotifications());

    return () => {
      unsubscribe();
      notificationService.disconnect();
    };
  }, []);

  const openNotifications = () => setIsOpen(true);
  const closeNotifications = () => setIsOpen(false);
  const getUnreadCount = () => notificationService.getUnreadCount();
  
  const handleNotificationClick = (notification) => {
    notificationService.markAsRead(notification.id);
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
  };

  return (
    <NotificationContext.Provider value={{ 
      openNotifications, 
      closeNotifications, 
      getUnreadCount,
      notifications 
    }}>
      {children}
      
      <AnimatePresence>
        {isOpen && (
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
    </NotificationContext.Provider>
  );
};