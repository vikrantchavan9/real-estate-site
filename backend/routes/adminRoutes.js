const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddlweware');
const pool = require('../config/db');
const router = express.Router();

// Get all users (admin-only route)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a specific user by ID (admin-only route)
router.get('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a user by ID (admin-only route)
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', user: user.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a user's role (admin-only route)
router.put('/users/:id/role', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const user = await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
            [role, id]
        );
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User role updated successfully', user: user.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all properties (admin-only route)
router.get('/properties', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const properties = await pool.query('SELECT * FROM properties');
        res.json(properties.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a property by ID (admin-only route)
router.delete('/properties/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const property = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
        if (property.rows.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json({ message: 'Property deleted successfully', property: property.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;