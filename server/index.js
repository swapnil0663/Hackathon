const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const pool = require('./config/database');
const { initializeSocket } = require('./socket');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
  } else {
    console.log('✅ Database connected successfully to PostgreSQL');
    console.log('💾 Database:', process.env.DB_NAME);
    console.log('👤 User:', process.env.DB_USER);
    console.log('🏠 Host:', process.env.DB_HOST + ':' + process.env.DB_PORT);
    release();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ComplainTrack API is running!' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Initialize Socket.IO
const io = initializeSocket(server);
app.set('io', io);

server.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('🔌 Socket.IO enabled for real-time notifications');
});