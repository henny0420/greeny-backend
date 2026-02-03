const express = require('express');
const router = express.Router();
const Product = require('../models/Product.js'); 

router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const regularPrice = parseFloat(productData.price) || 0;
        const discount = parseInt(productData.discount_percentage) || 0;
        
        if (discount > 0) {
            productData.final_price = regularPrice - ((regularPrice * discount) / 100);
        } else {
            productData.final_price = regularPrice;
        }
        
        const newProduct = new Product(productData);
        await newProduct.save();
        const populatedProduct = await Product.findById(newProduct._id).populate('category');
        res.status(201).json(populatedProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.category) { query.category = req.query.category; }
        if (req.query.offer_tag) { query.offer_tag = req.query.offer_tag; }
        if (req.query.search) { query.name = { $regex: req.query.search, $options: 'i' }; }
        if (req.query.collection) {
            const allowed = ['is_featured', 'is_popular', 'is_premium'];
            if (allowed.includes(req.query.collection)) {
                query[req.query.collection] = true;
            }
        }
        const products = await Product.find(query).populate('category');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



router.get('/by-category', async (req, res) => {
    try {
        const productsByCategory = await Product.aggregate([
            { $group: { _id: "$category", products: { $push: "$$ROOT" } } },
            { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "categoryData" } },
            { $unwind: "$categoryData" },
            { $project: { category: "$categoryData.name", products: "$products", _id: "$categoryData._id" } }
        ]);
        res.json(productsByCategory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/collection', async (req, res) => {
    const { type } = req.query;
    let query = {};
    if (type === 'featured') { query = { is_featured: true }; } 
    else if (type === 'popular') { query = { is_popular: true }; } 
    else { return res.json([]); }
    try {
        const products = await Product.find(query).limit(8).populate('category');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/offer/:tag', async (req, res) => {
    try {
        const products = await Product.find({ offer_tag: req.params.tag }).populate('category');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        // This checks if the ID format is invalid
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).populate('category');
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;