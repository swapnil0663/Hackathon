const express = require('express');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get messages for a room
router.get('/room/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM messages WHERE room_id = $1 ORDER BY timestamp ASC',
      [roomId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Save a message
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, message, roomId, senderName } = req.body;
    const senderId = req.user.id;
    
    const result = await pool.query(
      'INSERT INTO messages (sender_id, recipient_id, message, room_id, sender_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [senderId, recipientId, message, roomId, senderName]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;