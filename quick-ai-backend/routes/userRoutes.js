const express = require('express');
const router = express.Router();
const pool = require('../db.js'); // Import the database connection

// === 1. API ROUTES ===

// --- 🔹 Save User Route (from Clerk Signup/Login) ---
router.post('/saveUser', async (req, res) => {
  const { id, email } = req.body;
  if (!id || !email) {
    return res.status(400).json({ error: 'User ID and Email are required.' });
  }

  try {
    await pool.query(
      `INSERT INTO users (id, email)
       VALUES ($1, $2)
       ON CONFLICT (id) DO NOTHING`,
      [id, email]
    );

    console.log(`✅ User saved to DB: ${email}`);
    res.status(200).json({ message: 'User saved successfully' });
  } catch (err) {
    console.error('❌ Database insert error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- 🔹 NEW: Get User Profile & Plan ---
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) { 
      return res.status(404).json({ error: "User not found" });
    }
    
    // Return the user data (including current_plan)
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;