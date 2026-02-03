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
    price: { 
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

    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'category', 
        required: true
    },
    rating: { 
        type: Number,
        default: 0
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    is_popular: { 
        type: Boolean,
        default: false
    },
    is_premium: { 
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