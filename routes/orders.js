// const express = require('express');
// const router = express.Router();
// const Order = require('../models/order.js');

// // @route   GET api/orders
// // @desc    Get all orders (for a future 'View Orders' page)
// router.get('/', async (req, res) => {
//     try {
//         const orders = await Order.find().sort({ order_date: -1 }).populate('user', 'name');
//         res.json(orders);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // @route   GET api/orders/:id
// // @desc    Get a single order by ID with all details
// router.get('/:id', async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id)
//             .populate('user', ['name', 'email']) // Get the user's name and email
//             .populate('items.product', 'name'); // For each item, get the product's name

//         if (!order) {
//             return res.status(404).json({ msg: 'Order not found' });
//         }
//         res.json(order);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Order = require('../models/order.js');

// --- THIS IS THE MISSING CODE ---
// @route   POST api/orders
// @desc    Create a new order
router.post('/', async (req, res) => {
    // Get the data from the checkout page
    const { userId, cartItems, shippingAddress } = req.body;

    try {
        // Calculate the total amount on the server
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

// --- YOUR EXISTING CODE (which is correct) ---

// @route   GET api/orders
// @desc    Get all orders
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
// @desc    Get a single order by ID
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