const pool = require('../config/database');
const crypto = require('crypto');

// Generate secure session ID
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create session
const createSession = async (userId, userData) => {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  await pool.query(
    'INSERT INTO user_sessions (session_id, user_id, user_data, expires_at) VALUES ($1, $2, $3, $4)',
    [sessionId, userId, JSON.stringify(userData), expiresAt]
  );
  
  return sessionId;
};

// Get session
const getSession = async (sessionId) => {
  const result = await pool.query(
    'SELECT * FROM user_sessions WHERE session_id = $1 AND expires_at > NOW()',
    [sessionId]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return {
    ...result.rows[0],
    user_data: result.rows[0].user_data
  };
};

// Update session
const updateSession = async (sessionId, userData) => {
  await pool.query(
    'UPDATE user_sessions SET user_data = $1, updated_at = NOW() WHERE session_id = $2',
    [JSON.stringify(userData), sessionId]
  );
};

// Delete session
const deleteSession = async (sessionId) => {
  await pool.query('DELETE FROM user_sessions WHERE session_id = $1', [sessionId]);
};

// Clean expired sessions
const cleanExpiredSessions = async () => {
  await pool.query('DELETE FROM user_sessions WHERE expires_at <= NOW()');
};

module.exports = {
  createSession,
  getSession,
  updateSession,
  deleteSession,
  cleanExpiredSessions
};