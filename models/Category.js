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
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'category',
        required: true
    }

}, { timestamps: true });

const Category = mongoose.models.category || mongoose.model('category', categorySchema);

module.exports = Category;