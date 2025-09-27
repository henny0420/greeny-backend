const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');

// @route   GET api/orders
// @desc    Get all orders (for a future 'View Orders' page)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ order_date: -1 }).populate('user', 'name');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/orders/:id
// @desc    Get a single order by ID with all details
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', ['name', 'email']) // Get the user's name and email
            .populate('items.product', 'name'); // For each item, get the product's name

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;