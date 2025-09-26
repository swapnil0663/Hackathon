const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const router = express.Router();

// Generate next user ID starting from 7000
const generateUserId = async () => {
  try {
    const result = await pool.query('SELECT COALESCE(MAX(user_id), 6999) + 1 as next_id FROM users WHERE user_id IS NOT NULL');
    const nextId = result.rows[0].next_id;
    return nextId;
  } catch (error) {
    console.error('❌ Error generating user ID:', error.message);
    return 7000;
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [email, phone]);
    if (userExists.rows.length > 0) {
      console.log('❌ User already exists:', userExists.rows[0].email);
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    

    // Generate unique user ID
    const userId = await generateUserId();    
    if (!userId || userId === null || userId === undefined) {
      throw new Error('Failed to generate user_id');
    }
    
    const newUser = await pool.query(
      'INSERT INTO users (user_id, full_name, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, fullName, email, phone, hashedPassword]
    );
    
    if (!newUser.rows[0].user_id) {
      console.error('❌ user_id is null in database response!');
      throw new Error('user_id was not properly set in database');
    }

    console.log('✅ User created successfully in database:', {
      id: newUser.rows[0].id,
      userId: newUser.rows[0].user_id,
      fullName: newUser.rows[0].full_name,
      email: newUser.rows[0].email,
      createdAt: newUser.rows[0].created_at
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store token in PostgreSQL
    await pool.query(
      'INSERT INTO user_sessions (session_id, user_id, user_data, expires_at) VALUES ($1, $2, $3, $4)',
      [token, newUser.rows[0].id, JSON.stringify({
        id: newUser.rows[0].id,
        userId: newUser.rows[0].user_id,
        fullName: newUser.rows[0].full_name,
        email: newUser.rows[0].email,
        phone: newUser.rows[0].phone,
        role: newUser.rows[0].role || 'user'
      }), new Date(Date.now() + 24 * 60 * 60 * 1000)]
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.rows[0].id,
        userId: newUser.rows[0].user_id,
        fullName: newUser.rows[0].full_name,
        email: newUser.rows[0].email,
        phone: newUser.rows[0].phone,
        role: newUser.rows[0].role || 'user'
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      console.log('❌ Missing login credentials');
      return res.status(400).json({ message: 'Email/phone and password are required' });
    }

    const user = await pool.query(
      'SELECT id, user_id, full_name, email, phone, password, role, created_at FROM users WHERE email = $1 OR phone = $1',
      [emailOrPhone]
    );

    if (user.rows.length === 0) {
      console.log('❌ User not found in database:', emailOrPhone);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found in database:', {
      id: user.rows[0].id,
      fullName: user.rows[0].full_name,
      email: user.rows[0].email,
      createdAt: user.rows[0].created_at
    });


    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      console.log('❌ Password verification failed for:', emailOrPhone);
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    // Generate JWT token
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store token in PostgreSQL
    await pool.query(
      'INSERT INTO user_sessions (session_id, user_id, user_data, expires_at) VALUES ($1, $2, $3, $4)',
      [token, user.rows[0].id, JSON.stringify({
        id: user.rows[0].id,
        userId: user.rows[0].user_id,
        fullName: user.rows[0].full_name,
        email: user.rows[0].email,
        phone: user.rows[0].phone,
        role: user.rows[0].role || 'user'
      }), new Date(Date.now() + 24 * 60 * 60 * 1000)]
    );

    console.log('🎫 JWT token created and stored for login');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.rows[0].id,
        userId: user.rows[0].user_id,
        fullName: user.rows[0].full_name,
        email: user.rows[0].email,
        phone: user.rows[0].phone,
        role: user.rows[0].role || 'user'
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create admin user (temporary route for testing)
router.post('/create-admin', async (req, res) => {
  try {
    const adminEmail = 'admin';
    const adminPassword = 'admin@123';
    
    // Check if admin already exists
    const existingAdmin = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Generate unique user ID
    const userId = await generateUserId();
    
    const newAdmin = await pool.query(
      'INSERT INTO users (user_id, full_name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, 'Admin User', adminEmail, '1234567890', hashedPassword, 'admin']
    );
    
    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('❌ Admin creation error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;
    console.log('🔄 Logout request');

    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }

    await pool.query('DELETE FROM user_sessions WHERE session_id = $1', [token]);
    console.log('✅ Token deleted successfully');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    res.status(500).json({ message: 'Logout failed' });
  }
});

module.exports = router;