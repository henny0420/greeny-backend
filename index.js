
import serverless from "serverless-http";

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


  // Export the app for Vercel
module.exports = app;

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import serverless from "serverless-http";

// // Only load dotenv locally
// if (process.env.NODE_ENV !== "production") {
//   const dotenv = await import("dotenv");
//   dotenv.config();
// }

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB connection (connect once globally)
// const mongoURI = process.env.MONGO_URI;
// if (!mongoURI) {
//   console.error("❌ MONGO_URI is missing!");
// } else {
//   mongoose.connect(mongoURI)
//     .then(() => console.log("✅ MongoDB connected successfully!"))
//     .catch((err) => console.error("❌ MongoDB connection error:", err));
// }

// // Routes
// import productsRoute from "./routes/products.js";
// import categoriesRoute from "./routes/categories.js";
// import usersRoute from "./routes/users.js";
// import dashboardRoute from "./routes/dashboard.js";
// import ordersRoute from "./routes/orders.js";

// app.use("/api/products", productsRoute);
// app.use("/api/categories", categoriesRoute);
// app.use("/api/users", usersRoute);
// app.use("/api/dashboard", dashboardRoute);
// app.use("/api/orders", ordersRoute);

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Welcome to the Greeny Backend API (Vercel)!");
// });

// // Instead of app.listen, export handler for Vercel
// export const handler = serverless(app);
