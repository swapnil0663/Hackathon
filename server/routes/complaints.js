const express = require('express');
const pool = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');
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

// Get all complaints (admin)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const complaints = await pool.query(`
      SELECT 
        c.id,
        c.complaint_id,
        c.title,
        c.description,
        c.category,
        c.location,
        c.priority,
        c.status,
        c.created_at,
        c.updated_at,
        u.full_name as user_name,
        u.email as user_email
      FROM complaints c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);

    res.json(complaints.rows);
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (admin)
router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await pool.query(`
      SELECT 
        id,
        user_id,
        full_name,
        email,
        phone,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(users.rows);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update complaint status (admin)
router.put('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedComplaint = await pool.query(
      'UPDATE complaints SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (updatedComplaint.rows.length === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.json(updatedComplaint.rows[0]);
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard statistics
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    // Get total complaints count
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM complaints');
    const total = parseInt(totalResult.rows[0].total);

    // Get counts by status
    const statusResult = await pool.query(
      'SELECT status, COUNT(*) as count FROM complaints GROUP BY status'
    );
    const statusCounts = statusResult.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {});

    // Get complaints by category
    const categoryResult = await pool.query(
      'SELECT category, COUNT(*) as count FROM complaints GROUP BY category ORDER BY count DESC'
    );
    const categories = categoryResult.rows;

    // Get monthly trends (last 6 months)
    const trendsResult = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as total_complaints,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_complaints
      FROM complaints 
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);
    const trends = trendsResult.rows;

    res.json({
      total,
      pending: statusCounts.pending || 0,
      in_progress: statusCounts.in_progress || 0,
      resolved: statusCounts.resolved || 0,
      categories,
      trends
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;