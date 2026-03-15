const express = require('express');
const Expertise = require('../models/Expertise');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all expertise items (Public)
router.get('/', async (req, res) => {
    try {
        const expertise = await Expertise.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: expertise });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create expertise item (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const expertise = await Expertise.create(req.body);
        res.status(201).json({ success: true, data: expertise });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update expertise item (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const expertise = await Expertise.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!expertise) {
            return res.status(404).json({ success: false, message: 'Expertise not found' });
        }
        res.status(200).json({ success: true, data: expertise });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete expertise item (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const expertise = await Expertise.findByIdAndDelete(req.params.id);
        if (!expertise) {
            return res.status(404).json({ success: false, message: 'Expertise not found' });
        }
        res.status(200).json({ success: true, message: 'Expertise deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
