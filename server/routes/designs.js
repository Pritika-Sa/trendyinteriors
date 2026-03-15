const express = require('express');
const Design = require('../models/Design');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all designs
router.get('/', async (req, res) => {
  try {
    const designs = await Design.find().sort({ order: 1 }).exec();
    res.status(200).json({
      success: true,
      message: 'Designs retrieved successfully',
      data: designs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving designs',
      error: error.message,
    });
  }
});

// Get single design
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }
    res.status(200).json({
      success: true,
      data: design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving design',
      error: error.message,
    });
  }
});

// Create new design (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { title, imageUrl, description, order } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and image URL are required',
      });
    }

    const newDesign = new Design({
      title,
      imageUrl,
      description,
      order: order || 0,
    });

    await newDesign.save();
    res.status(201).json({
      success: true,
      message: 'Design created successfully',
      data: newDesign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating design',
      error: error.message,
    });
  }
});

// Update design (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, imageUrl, description, order } = req.body;

    const design = await Design.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          imageUrl,
          description,
          order,
        },
      },
      { new: true, runValidators: true }
    );

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Design updated successfully',
      data: design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating design',
      error: error.message,
    });
  }
});

// Delete design (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Design not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Design deleted successfully',
      data: design,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting design',
      error: error.message,
    });
  }
});

module.exports = router;
