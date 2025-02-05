const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const upload = require('../multerConfig');
const fs = require('fs'); 
const path = require('path');

// Serve static files from the 'uploads' folder
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Get all properties
router.get('/properties', async (req, res) => {
    try {
        const allProperties = await pool.query('SELECT * FROM properties');
        res.json(allProperties.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new property
router.post('/properties', async (req, res) => {
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

// Add this endpoint to your existing backend code
router.get('/properties/:id/images', async (req, res) => {
    const { id } = req.params;
    try {
        const images = await pool.query('SELECT * FROM images WHERE property_id = $1', [id]);
        res.json(images.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add this endpoint to your existing backend code
router.post('/images', async (req, res) => {
    const { property_id, image_url, is_primary } = req.body;
    try {
        const newImage = await pool.query(
            'INSERT INTO images (property_id, image_url, is_primary) VALUES ($1, $2, $3) RETURNING *',
            [property_id, image_url, is_primary]
        );
        res.json(newImage.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/images/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM images WHERE id = $1', [id]);
        res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/images/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the image URL from the database
        const image = await pool.query('SELECT image_url FROM images WHERE id = $1', [id]);

        if (image.rows.length === 0) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const imageUrl = image.rows[0].image_url;

        // Extract the filename from the URL
        const filename = path.basename(imageUrl);

        // Delete the image file from the /uploads folder
        const filePath = path.join(__dirname, 'uploads', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ message: 'Error deleting file' });
            }

            // Delete the image record from the database
            pool.query('DELETE FROM images WHERE id = $1', [id])
                .then(() => {
                    res.json({ message: 'Image deleted successfully' });
                })
                .catch((err) => {
                    console.error(err.message);
                    res.status(500).send('Server error');
                });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
  
const handleDeleteImage = async (imageId) => {
    try {
        await axios.delete(`http://localhost:5000/images/${imageId}`);
        alert('Image deleted successfully!');
        fetchProperties(); // Refresh the property list
    } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image.');
    }
};


// Add this endpoint to handle image uploads
router.post('/images/upload', upload.single('image'), async (req, res) => {
    const { property_id, is_primary } = req.body;

    // Generate the full image URL
    const image_url = `http://localhost:5000/uploads/${req.file.filename}`;

    try {
        const newImage = await pool.query(
            'INSERT INTO images (property_id, image_url, is_primary) VALUES ($1, $2, $3) RETURNING *',
            [property_id, image_url, is_primary]
        );
        res.json(newImage.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;