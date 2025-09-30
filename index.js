const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// require('dotenv').config();
if (process.env.NODE_ENV !== "production") {
  import("dotenv").then(dotenv => dotenv.config());
}


const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Define Routes
app.use('/api/products', require('./routes/products.js'));
app.use('/api/categories', require('./routes/categories.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/dashboard', require('./routes/dashboard.js'));
app.use('/api/orders', require('./routes/orders.js'));

// Test Route
app.get('/', (req, res) => {
    res.send('Welcome to the Greeny Backend API!');
});

// Connect to Database and then Start Server
mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  });