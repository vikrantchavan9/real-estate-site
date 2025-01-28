const express = require('express');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Get all properties
app.get('/properties', async (req, res) => {
    try {
        const allProperties = await pool.query('SELECT * FROM properties');
        res.json(allProperties.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new property
app.post('/properties', async (req, res) => {
    const { title, description, type, price, bedrooms, bathrooms, area, status } = req.body;
    try {
        const newProperty = await pool.query(
            'INSERT INTO properties (title, description, type, price, bedrooms, bathrooms, area, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, description, type, price, bedrooms, bathrooms, area, status]
        );
        res.json(newProperty.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});