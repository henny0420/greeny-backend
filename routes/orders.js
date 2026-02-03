
const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');


router.post('/', async (req, res) => {
    const { userId, cartItems, shippingAddress } = req.body;

    try {
        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += (item.final_price || item.price) * item.quantity;
        });

        const newOrder = new Order({
            user: userId,
            items: cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity
            })),
            total_amount: totalAmount,
            shipping_address: `${shippingAddress.fullName}\n${shippingAddress.address}`,
            status: 'Pending'
        });

        const order = await newOrder.save();
        res.status(201).json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ order_date: -1 }).populate('user', 'name');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', ['name', 'email'])
            .populate('items.product', 'name'); 

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/my-orders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .sort({ order_date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;