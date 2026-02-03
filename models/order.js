// models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
            quantity: { type: Number, required: true },
        },
    ],
    total_amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    order_date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);
module.exports = Order;