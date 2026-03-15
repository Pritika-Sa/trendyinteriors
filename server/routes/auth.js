const express = require('express');
const { register, login, getMe, updateDetails, changePassword, forgotPassword, resetPassword, verifyResetOTP, sendChangePasswordOTP, changePasswordWithOTP } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/mail');
const { sendAdminEmail } = require('../utils/mail');
const { generateContactEmailHTML } = require('../utils/emailTemplates');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.post('/send-change-password-otp', protect, sendChangePasswordOTP);
router.put('/change-password-with-otp', protect, changePasswordWithOTP);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/change-password', protect, changePassword);
router.put('/changepassword', protect, changePassword); // Keep old endpoint for compatibility

// Debug endpoint - Test admin email (contact inquiry simulation)
router.post('/test-email', async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'trendyadmin123@gmail.com';
    console.log('[TEST EMAIL] Testing admin email send to:', adminEmail);
    
    const testData = {
      name: 'Test User',
      email: 'testuser@example.com',
      purpose: 'Test Inquiry',
      mobileNumber: '9876543210',
      message: 'This is a test inquiry to verify email notifications are working. If you received this, the contact form alerts are configured correctly.'
    };
    
    const result = await sendAdminEmail({
      to: adminEmail,
      subject: '🏢 TEST: New Customer Inquiry from Test User - Test Inquiry',
      html: generateContactEmailHTML(testData),
    });
    
    console.log('[TEST EMAIL] ✅ Test email sent successfully');
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully to ' + adminEmail,
      details: {
        recipient: adminEmail,
        subject: '🏢 TEST: New Customer Inquiry from Test User - Test Inquiry',
        status: 'Email sent - Check your inbox'
      }
    });
  } catch (err) {
    console.error('[TEST EMAIL] ❌ Error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email: ' + err.message,
      troubleshooting: 'Check if SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS environment variables are correctly set. Check server logs for detailed error info.'
    });
  }
});

module.exports = router;


