const express = require('express');
const router = express.Router();
// FIX: The model file is lowercase 'category.js'
const Category = require('../models/Category.js');

// @route   GET api/categories
// @desc    Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 'asc' });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, image_url } = req.body;
        
        // Check if category already exists
        let category = await Category.findOne({ name });
        if (category) {
            return res.status(400).json({ msg: 'Category already exists' });
        }

        category = new Category({ name, image_url });
        await category.save();
        res.status(201).json(category);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;