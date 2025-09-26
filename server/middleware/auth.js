const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token exists in PostgreSQL
    const session = await pool.query(
      'SELECT user_data FROM user_sessions WHERE session_id = $1 AND expires_at > NOW()',
      [token]
    );
    
    if (session.rows.length === 0) {
      return res.status(401).json({ message: 'Token not found or expired' });
    }
    
    req.user = session.rows[0].user_data;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = { auth, adminAuth };