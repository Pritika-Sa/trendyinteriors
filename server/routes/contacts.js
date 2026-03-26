const express = require('express');
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/authMiddleware');
const { sendAdminEmail } = require('../utils/mail');
const { generateContactEmailHTML } = require('../utils/emailTemplates');
const router = express.Router();

// Create contact (public - for all visitors)
router.post('/', async (req, res) => {
  try {
    const { name, email, purpose, mobileNumber, message } = req.body;

    const contact = new Contact({
      name,
      email,
      purpose,
      mobileNumber,
      message,
    });

    await contact.save();

    // send admin email with professional HTML template
    sendAdminEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🏢 New Customer Inquiry from ${name} - ${purpose}`,
      html: generateContactEmailHTML({ name, email, purpose, mobileNumber, message }),
    }).catch((err) => {
      console.error('[CONTACTS] Failed to send admin email:', err.message);
    });

    // notify admin UI via socket
    req.app.get('io')?.emit('admin:newContact', { id: contact._id, email: contact.email, name: contact.name, mobileNumber: contact.mobileNumber, createdAt: contact.createdAt });

    res.status(201).json({ success: true, message: 'Contact form submitted successfully', data: contact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all contacts (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single contact (Admin only)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update contact status (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete contact (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
