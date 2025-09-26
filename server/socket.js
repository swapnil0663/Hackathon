const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const userSockets = new Map(); // userId -> socketId

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      console.log('🔐 Socket auth attempt with token:', token ? 'Present' : 'Missing');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('👤 Decoded user:', { id: decoded.id, role: decoded.role });
      
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      console.log('❌ Socket auth error:', err.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`👤 User ${socket.userId} (${socket.userRole}) connected with socket ${socket.id}`);
    // Store both string and integer versions of user ID
    userSockets.set(socket.userId, socket.id);
    userSockets.set(parseInt(socket.userId), socket.id);

    // Send a test notification to verify connection
    setTimeout(() => {
      if (socket.userRole === 'admin') {
        socket.emit('newComplaint', {
          complaintId: 'TEST001',
          userName: 'Test User',
          title: 'Test Notification',
          category: 'Test'
        });
        console.log('🧪 Test notification sent to admin');
      } else {
        socket.emit('statusUpdate', {
          complaintId: 'TEST001',
          status: 'pending',
          title: 'Test Status Update'
        });
        console.log('🧪 Test notification sent to user');
      }
    }, 2000);

    socket.on('disconnect', () => {
      console.log(`👋 User ${socket.userId} disconnected`);
      userSockets.delete(socket.userId);
      userSockets.delete(parseInt(socket.userId));
    });
  });

  return io;
};

const emitToUser = (userId, event, data) => {
  const socketId = userSockets.get(userId);
  if (socketId && io) {
    io.to(socketId).emit(event, data);
  }
};

const emitToAdmins = (event, data) => {
  console.log('🔔 Attempting to emit to admins:', event, data);
  console.log('📊 Connected users:', Array.from(userSockets.entries()));
  
  if (io) {
    let adminCount = 0;
    const processedSockets = new Set();
    
    // Emit to all connected admin users
    for (const [userId, socketId] of userSockets.entries()) {
      // Skip if we already processed this socket
      if (processedSockets.has(socketId)) continue;
      processedSockets.add(socketId);
      
      const socket = io.sockets.sockets.get(socketId);
      console.log(`👤 User ${userId} - Socket: ${socketId}, Role: ${socket?.userRole}`);
      
      if (socket && socket.userRole === 'admin') {
        console.log(`✅ Emitting ${event} to admin ${userId}`);
        socket.emit(event, data);
        adminCount++;
      }
    }
    console.log(`📢 Notification sent to ${adminCount} admin(s)`);
  } else {
    console.log('❌ Socket.IO not initialized');
  }
};

const emitNewComplaint = (complaintData, userName) => {
  console.log('🆕 New complaint notification:', { complaintData, userName });
  emitToAdmins('newComplaint', {
    complaintId: complaintData.complaint_id || `CMP${String(complaintData.id).padStart(6, '0')}`,
    userName: userName,
    title: complaintData.title,
    category: complaintData.category
  });
};

const emitStatusUpdate = (userId, complaintData) => {
  console.log('🔄 Status update notification for user:', userId, complaintData);
  const socketId = userSockets.get(parseInt(userId));
  console.log('📍 User socket ID:', socketId);
  
  if (socketId && io) {
    console.log('✅ Emitting status update to user', userId);
    io.to(socketId).emit('statusUpdate', {
      complaintId: complaintData.complaint_id || `CMP${String(complaintData.id).padStart(6, '0')}`,
      status: complaintData.status,
      title: complaintData.title
    });
  } else {
    console.log('❌ User not connected or socket not found for user:', userId);
  }
};

module.exports = {
  initializeSocket,
  emitNewComplaint,
  emitStatusUpdate
};