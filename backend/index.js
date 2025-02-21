require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('./config/passport'); 
const path = require('path');

const app = express();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const pool = require('../backend/config/db');
const upload = require('../backend/multerConfig');
const fs = require('fs'); 


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

//Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("Session Data:", req.session);
  console.log("User Data:", req.session.user);
  next();
});

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Add this endpoint to your existing backend code
app.get('/properties/:id/images', async (req, res) => {
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
app.post('/images', async (req, res) => {
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

app.delete('/images/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM images WHERE id = $1', [id]);
        res.json({ message: 'Image deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.delete('/images/:id', async (req, res) => {
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
app.post('/images/upload', upload.single('image'), async (req, res) => {
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});