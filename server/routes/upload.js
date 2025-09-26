const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = req.route.path.includes('evidence') ? 'evidence-' : 'user-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'audio/wav', 'audio/mpeg', 'audio/mp3'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported!'), false);
    }
  }
});

// Upload user image
router.post('/user-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const imagePath = req.file.path;
    const imageName = req.file.filename;

    // Save image info to database
    const result = await pool.query(
      'INSERT INTO user_images (user_id, image_path, image_name) VALUES ($1, $2, $3) RETURNING *',
      [userId, imagePath, imageName]
    );

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: result.rows[0]
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user image
router.get('/user-image/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if table exists and create if not
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_images (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        image_path VARCHAR(500) NOT NULL,
        image_name VARCHAR(255) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const result = await pool.query(
      'SELECT * FROM user_images WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT 1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No image found for user' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user image error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST evidence upload
router.post('/evidence', upload.single('evidence'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    res.json({
      message: 'Evidence uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path
    });
  } catch (error) {
    console.error('Error uploading evidence:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save complaint attachments
router.post('/complaint-attachments', auth, async (req, res) => {
  try {
    const { complaintId, files } = req.body;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }
    
    const attachments = [];
    for (const file of files) {
      const result = await pool.query(
        'INSERT INTO complaint_attachments (complaint_id, file_name, file_path, file_type) VALUES ($1, $2, $3, $4) RETURNING *',
        [complaintId, file.originalName, file.filename, file.mimetype]
      );
      attachments.push(result.rows[0]);
    }
    
    res.json({
      message: 'Attachments saved successfully',
      attachments
    });
  } catch (error) {
    console.error('Error saving attachments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;