

  const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/products', require('./routes/products.js'));
app.use('/api/categories', require('./routes/categories.js'));
app.use('/api/users', require('./routes/users.js'));
app.use('/api/dashboard', require('./routes/dashboard.js'));
app.use('/api/orders', require('./routes/orders.js'));

app.get('/', (req, res) => {
    res.send('Welcome to the Greeny Backend API!');
});

const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!mongoURI) {
    console.error("MONGO_URI is not defined! Server cannot start.");
    process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

