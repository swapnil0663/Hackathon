const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Create complaint
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const userId = req.user.userId;

    const newComplaint = await pool.query(
      'INSERT INTO complaints (user_id, title, description, category, priority, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, title, description, category, priority || 'medium', 'pending']
    );

    res.status(201).json({
      message: 'Complaint created successfully',
      complaint: newComplaint.rows[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user complaints
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const complaints = await pool.query(
      'SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(complaints.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get complaint by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const complaint = await pool.query(
      'SELECT * FROM complaints WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (complaint.rows.length === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;