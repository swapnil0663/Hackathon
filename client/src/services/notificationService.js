import { io } from 'socket.io-client';

class NotificationService {
  constructor() {
    this.socket = null;
    this.notifications = [];
    this.listeners = [];
  }

  connect() {
    this.socket = io('http://localhost:5000');
    
    this.socket.on('connect', () => {
      console.log('Connected to notification service');
    });

    this.socket.on('newComplaint', (data) => {
      const notification = {
        id: Date.now(),
        message: `New complaint #${data.complaintId} submitted by ${data.userName}`,
        time: 'Just now',
        type: 'new_complaint'
      };
      this.addNotification(notification);
    });

    this.socket.on('complaintUpdate', (data) => {
      const notification = {
        id: Date.now(),
        message: `Complaint #${data.complaintId} status updated to ${data.status}`,
        time: 'Just now',
        type: 'status_update'
      };
      this.addNotification(notification);
    });
  }

  addNotification(notification) {
    this.notifications.unshift(notification);
    if (this.notifications.length > 10) {
      this.notifications = this.notifications.slice(0, 10);
    }
    this.notifyListeners();
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
    this.listeners.forEach(callback => callback(this.notifications));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new NotificationService();