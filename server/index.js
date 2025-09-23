const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/database');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');

const app = express();
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

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ComplainTrack API is running!' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('🌐 API Base URL: http://localhost:' + PORT + '/api');
  console.log('📊 Health Check: http://localhost:' + PORT);
  console.log('⚙️ Environment:', process.env.NODE_ENV || 'development');
  console.log('\n📝 Available endpoints:');
  console.log('  POST /api/auth/register - User registration');
  console.log('  POST /api/auth/login - User login');
  console.log('  GET /api/test - API test endpoint');
  console.log('\n👀 Watch the logs below for registration and login activity...\n');
});