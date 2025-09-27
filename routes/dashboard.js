// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');
const Product = require('../models/product.js');

// @route   GET api/dashboard/stats
// @desc    Get all dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalRevenueResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$total_amount' } } },
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
        
        const todayOrders = await Order.countDocuments({ order_date: { $gte: today } });
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const totalProducts = await Product.countDocuments();

        const recentOrders = await Order.find()
            .sort({ order_date: -1 })
            .limit(5)
            .populate('user', 'name'); // Gets the user's name from the user collection

        res.json({
            todayRevenue: totalRevenue, // Note: This is total, not just today's for simplicity
            todayOrders,
            pendingOrders,
            totalProducts,
            recentOrders,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;