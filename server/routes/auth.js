const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    console.log('🔵 Registration attempt:', { fullName, email, phone });

    if (!fullName || !email || !phone || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    console.log('🔍 Checking if user exists with email:', email);
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [email, phone]);
    if (userExists.rows.length > 0) {
      console.log('❌ User already exists:', userExists.rows[0].email);
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    console.log('💾 Inserting user into database...');
    const newUser = await pool.query(
      'INSERT INTO users (full_name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, phone, created_at',
      [fullName, email, phone, hashedPassword]
    );

    console.log('✅ User created successfully in database:', {
      id: newUser.rows[0].id,
      fullName: newUser.rows[0].full_name,
      email: newUser.rows[0].email,
      createdAt: newUser.rows[0].created_at
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.rows[0].id, role: newUser.rows[0].role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store token in PostgreSQL
    await pool.query(
      'INSERT INTO user_sessions (session_id, user_id, user_data, expires_at) VALUES ($1, $2, $3, $4)',
      [token, newUser.rows[0].id, JSON.stringify({
        id: newUser.rows[0].id,
        fullName: newUser.rows[0].full_name,
        email: newUser.rows[0].email,
        phone: newUser.rows[0].phone,
        role: newUser.rows[0].role || 'user'
      }), new Date(Date.now() + 24 * 60 * 60 * 1000)]
    );

    console.log('🎫 JWT token created and stored for user ID:', newUser.rows[0].id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.rows[0].id,
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
    console.log('🔑 Login attempt for:', emailOrPhone);

    if (!emailOrPhone || !password) {
      console.log('❌ Missing login credentials');
      return res.status(400).json({ message: 'Email/phone and password are required' });
    }

    // Find user by email or phone
    console.log('🔍 Searching for user in database:', emailOrPhone);
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR phone = $1',
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

    // Check password
    console.log('🔐 Verifying password...');
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      console.log('❌ Password verification failed for:', emailOrPhone);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password verified successfully');

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.rows[0].id, role: user.rows[0].role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store token in PostgreSQL
    await pool.query(
      'INSERT INTO user_sessions (session_id, user_id, user_data, expires_at) VALUES ($1, $2, $3, $4)',
      [token, user.rows[0].id, JSON.stringify({
        id: user.rows[0].id,
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