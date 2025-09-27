const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: { // This will be our "regular_price"
        type: Number,
        required: true
    },
    final_price: {
        type: Number 
    },
    imageUrl: {
        type: String,
        required: true
    },
   // models/product.js

// ... (other fields like name, description, etc.)
    category: {
        type: mongoose.Schema.Types.ObjectId, // The type is now an ObjectId
        ref: 'category', // This tells Mongoose it refers to the 'category' model
        required: true
    },
    rating: { // Added from your old table
        type: Number,
        default: 0
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    is_popular: { // Added from your old table
        type: Boolean,
        default: false
    },
    is_premium: { // We'll keep this one from our previous discussion
        type: Boolean,
        default: false
    },
    discount_percentage: {
        type: Number,
        default: 0
    },
    offer_tag: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Product = mongoose.models.product || mongoose.model('product', productSchema);

module.exports = Product;