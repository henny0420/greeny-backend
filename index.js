const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
app.use('/api/products', require('./routes/products.js'));
app.use('/api/categories', require('./routes/categories.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/dashboard', require('./routes/dashboard.js'));
app.use('/api/orders', require('./routes/orders.js'));

// --- Test Route ---
app.get('/', (req, res) => {
    res.send('Welcome to the Greeny Backend API!');
});

// --- Start Server for Local Development ---
// This block will only run on your local machine, not on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// --- Export the app for Vercel ---
module.exports = app;