import { io } from 'socket.io-client';
import tokenManager from '../utils/sessionManager';

class NotificationService {
  constructor() {
    this.socket = null;
    this.notifications = [];
    this.listeners = [];
  }

  connect() {
    const token = tokenManager.getToken();
    const user = tokenManager.getUser();
    
    console.log('🔌 Connecting to notification service with user:', { id: user?.id, role: user?.role });
    
    if (!token || !user) {
      console.log('❌ No token or user found, skipping connection');
      return;
    }

    this.socket = io('http://localhost:5000', {
      auth: {
        token: token,
        userId: user.id,
        role: user.role
      }
    });
    
    this.socket.on('connect', () => {
      console.log('✅ Connected to notification service');
    });
    
    this.socket.on('connect_error', (error) => {
      console.log('❌ Socket connection error:', error.message);
    });

    this.socket.on('newComplaint', (data) => {
      console.log('🆕 Received new complaint notification:', data);
      const notification = {
        id: Date.now(),
        message: `New complaint #${data.complaintId} submitted by ${data.userName}`,
        time: this.formatTime(new Date()),
        type: 'new_complaint',
        read: false
      };
      this.addNotification(notification);
    });

    this.socket.on('statusUpdate', (data) => {
      console.log('🔄 Received status update notification:', data);
      const notification = {
        id: Date.now(),
        message: `Your complaint #${data.complaintId} status changed to ${data.status.replace('_', ' ').toUpperCase()}`,
        time: this.formatTime(new Date()),
        type: 'status_update',
        read: false
      };
      this.addNotification(notification);
    });
  }

  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  }

  addNotification(notification) {
    console.log('🔔 Adding notification:', notification);
    this.notifications.unshift(notification);
    if (this.notifications.length > 20) {
      this.notifications = this.notifications.slice(0, 20);
    }
    console.log('📊 Total notifications:', this.notifications.length);
    this.notifyListeners();
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  getNotifications() {
    return this.notifications;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    console.log('📢 Notifying', this.listeners.length, 'listeners with', this.notifications.length, 'notifications');
    this.listeners.forEach(callback => callback(this.notifications));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new NotificationService();