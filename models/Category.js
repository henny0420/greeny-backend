const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image_url: {
        type: String,
        required: true 
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // The type is now an ObjectId
        ref: 'category', // This tells Mongoose it refers to the 'category' model
        required: true
    }

}, { timestamps: true });

// Use the safe method to define the model
const Category = mongoose.models.category || mongoose.model('category', categorySchema);

module.exports = Category;