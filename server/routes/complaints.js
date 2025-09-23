const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Generate complaint ID
const generateComplaintId = async () => {
  const result = await pool.query('SELECT MAX(id) as max_id FROM complaints');
  const nextId = (result.rows[0]?.max_id || 0) + 1;
  return `CMP${String(nextId).padStart(6, '0')}`;
};

// Create complaint
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, location, priority } = req.body;
    console.log('📝 Creating complaint with data:', { title, description, category, location, priority });
    console.log('👤 User from auth:', req.user);
    
    const userId = req.user.id;
    const complaintId = await generateComplaintId();
    console.log('🆔 Generated complaint ID:', complaintId);

    const newComplaint = await pool.query(
      'INSERT INTO complaints (user_id, complaint_id, title, description, category, location, priority, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [userId, complaintId, title, description, category, location, priority || 'medium', 'pending']
    );

    console.log('✅ Complaint created:', newComplaint.rows[0]);
    res.status(201).json({
      message: 'Complaint created successfully',
      complaint: newComplaint.rows[0]
    });
  } catch (error) {
    console.error('❌ Complaint creation error:', error.message);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user complaints
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id; // Use id instead of userId
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
    const userId = req.user.id; // Use id instead of userId

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