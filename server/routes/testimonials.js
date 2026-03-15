const express = require('express');
const Testimonial = require('../models/Testimonial');
const { protect, authorize } = require('../middleware/authMiddleware');
const { sendAdminEmail } = require('../utils/mail');
const { generateTestimonialEmailHTML } = require('../utils/emailTemplates');
const router = express.Router();

// Create testimonial (Public - no login required)
router.post('/', async (req, res) => {
  try {
    const { name, postalAddress, mobileNumber, testimonialText, rating } = req.body;

    const testimonial = new Testimonial({
      name: name || 'Guest User',
      postalAddress,
      mobileNumber,
      testimonialText,
      rating: rating || 5,
      approved: false,
    });

    await testimonial.save();

    // send admin email with professional HTML template
    sendAdminEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `⭐ New Testimonial from ${name || 'Guest'} - ${rating} Star Rating`,
      html: generateTestimonialEmailHTML({ name, testimonialText, rating, mobileNumber, postalAddress }),
    }).catch((err) => {
      console.error('[TESTIMONIALS] Failed to send admin email:', err.message);
    });

    // notify admin UI
    req.app.get('io')?.emit('admin:newTestimonial', { id: testimonial._id, name: testimonial.name, createdAt: testimonial.createdAt });

    res.status(201).json({ success: true, message: 'Testimonial submitted successfully', data: testimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all approved testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all testimonials (Admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve testimonial (Admin only)
router.patch('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });

    // notify customers / public UI that a testimonial was approved
    req.app.get('io')?.emit('testimonial:approved', { id: testimonial._id, payload: testimonial });

    res.status(200).json({ success: true, message: 'Testimonial approved', data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reject/Unapprove testimonial (Admin only)
router.patch('/:id/deny', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { approved: false }, { new: true });
    res.status(200).json({ success: true, message: 'Testimonial removed from website', data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete testimonial (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
