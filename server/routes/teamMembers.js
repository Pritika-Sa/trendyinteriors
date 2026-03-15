const express = require('express');
const TeamMember = require('../models/TeamMember');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all team members (Public)
router.get('/', async (req, res) => {
    try {
        const teamMembers = await TeamMember.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: teamMembers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create team member (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const teamMember = await TeamMember.create(req.body);
        res.status(201).json({ success: true, data: teamMember });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update team member (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const teamMember = await TeamMember.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!teamMember) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        res.status(200).json({ success: true, data: teamMember });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete team member (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        res.status(200).json({ success: true, message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
