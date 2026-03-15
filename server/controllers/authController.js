const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validatePassword } = require('../utils/passwordValidation');
const sendEmail = require('../utils/mail');
const { sendAdminEmail } = require('../utils/mail');
const { generateAdminLoginAlertHTML, generatePasswordChangeAlertHTML, generatePasswordResetOTPHTML, generateChangePasswordOTPHTML } = require('../utils/emailTemplates');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        let { name, email, password } = req.body;
        console.log('Register Request Received:', { name, email });

        // Normalize & Sanitize
        if (email) email = email.toLowerCase().trim();
        if (name) name = name.trim();

        // Validate required fields
        if (!name) return res.status(400).json({ success: false, error: 'Name is required' });
        if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
        if (!password) return res.status(400).json({ success: false, error: 'Password is required' });
        if (password.length < 6) return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });

        // 1. Manual Check
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Conflict: User already found in manual check:', userExists._id);
            return res.status(400).json({
                success: false,
                error: `Email ${email} is already taken.`
            });
        }

        // 2. Create User (Role defaults to 'user' in schema)
        console.log('Attempting to create user in DB...');
        const user = await User.create({
            name,
            email,
            password
        });
        console.log('User created successfully:', user._id);

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('Register Critical Error:', err);

        // Duplicate Key Error (MongoDB Code 11000)
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            const displayField = field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field';
            const value = err.keyValue ? err.keyValue[field] : '';

            return res.status(400).json({
                success: false,
                error: `Database Error: ${displayField} '${value}' already exists (Mongo Constraint).`
            });
        }

        // Validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }

        // General Error
        return res.status(500).json({
            success: false,
            error: `Server Error: ${err.message}`
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        email = email.toLowerCase().trim();

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Send login alert to admin email if user is admin
        if (user.role === 'admin') {
            try {
                await sendAdminEmail({
                    to: 'trendyadmin123@gmail.com',
                    subject: '🔐 Admin Login Alert - TrendyInterios',
                    html: generateAdminLoginAlertHTML({ name: user.name, email: user.email })
                });
            } catch (emailErr) {
                console.error('Failed to send admin login alert:', emailErr);
                // Don't fail the login if email fails
            }
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, error: 'Please provide all required fields' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, error: 'New passwords do not match' });
        }

        // Validate strong password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            const errors = Object.values(passwordValidation.errors).filter(err => err);
            return res.status(400).json({ 
                success: false, 
                error: errors.join('. ') 
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ success: false, error: 'New password must be different from current password' });
        }

        // Get user with password field
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Check if current password matches
        const isPasswordCorrect = await user.matchPassword(currentPassword);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, error: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Send password change alert to admin email
        if (user.role === 'admin') {
            try {
                await sendAdminEmail({
                    to: 'trendyadmin123@gmail.com',
                    subject: '✅ Admin Password Changed Successfully - TrendyInterios',
                    html: generatePasswordChangeAlertHTML({ name: user.name, email: user.email })
                });
            } catch (emailErr) {
                console.error('Failed to send password change alert:', emailErr);
                // Don't fail the password change if email fails
            }
        }

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Forgot password - Send OTP to admin email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Please provide an email address' });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({
                success: true,
                message: 'If an account with that email exists, an OTP has been sent to the registered admin email'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to user and set expiry (10 minutes)
        user.resetOTP = otp;
        user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send OTP email to admin email
        try {
            await sendAdminEmail({
                to: 'trendyadmin123@gmail.com',
                subject: '🔑 Password Reset OTP - TrendyInterios',
                html: generatePasswordResetOTPHTML({ otp })
            });

            return res.status(200).json({
                success: true,
                message: 'OTP sent to the registered admin email. Please check your email.'
            });
        } catch (err) {
            // Clear OTP on email error
            user.resetOTP = undefined;
            user.resetOTPExpire = undefined;
            await user.save();

            console.error('Email Error:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Could not send OTP email. Please try again later.' 
            });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Verify OTP for password reset
// @route   POST /api/auth/verify-reset-otp
// @access  Public
exports.verifyResetOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, error: 'Please provide email and OTP' });
        }

        // Find user by email with OTP
        const user = await User.findOne({ 
            email: email.toLowerCase().trim(),
            resetOTP: otp,
            resetOTPExpire: { $gt: Date.now() }
        }).select('+resetOTP +resetOTPExpire');

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        // OTP is valid, generate a temporary token for password reset
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = resetToken;
        user.resetOTP = undefined;
        user.resetOTPExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            resetToken: resetToken
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Reset password using verified OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { resetToken, password, confirmPassword } = req.body;

        if (!resetToken || !password || !confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide reset token and password' 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                error: 'Passwords do not match' 
            });
        }

        // Validate strong password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            const errors = Object.values(passwordValidation.errors).filter(err => err);
            return res.status(400).json({ 
                success: false, 
                error: errors.join('. ') 
            });
        }

        // Find user by reset token
        const user = await User.findOne({
            passwordResetToken: resetToken
        }).select('+passwordResetToken');

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid reset token' 
            });
        }

        // Update password
        user.password = password;
        user.passwordResetToken = undefined;
        await user.save();

        // Send password reset confirmation email to admin
        if (user.role === 'admin') {
            try {
                await sendAdminEmail({
                    to: 'trendyadmin123@gmail.com',
                    subject: '✅ Admin Password Reset Confirmation - TrendyInterios',
                    html: generatePasswordChangeAlertHTML({ name: user.name, email: user.email })
                });
            } catch (emailErr) {
                console.error('Failed to send password reset confirmation:', emailErr);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Send OTP for change password
// @route   POST /api/auth/send-change-password-otp
// @access  Private
exports.sendChangePasswordOTP = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to user and set expiry (10 minutes)
        user.changePasswordOTP = otp;
        user.changePasswordOTPExpire = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send OTP email to admin email
        try {
            await sendAdminEmail({
                to: 'trendyadmin123@gmail.com',
                subject: '🔑 Change Password OTP - TrendyInterios',
                html: generateChangePasswordOTPHTML({ otp })
            });

            return res.status(200).json({
                success: true,
                message: 'OTP sent to the registered admin email'
            });
        } catch (err) {
            // Clear OTP on email error
            user.changePasswordOTP = undefined;
            user.changePasswordOTPExpire = undefined;
            await user.save();

            console.error('Email Error:', err);
            return res.status(500).json({ 
                success: false, 
                error: 'Could not send OTP email. Please try again later.' 
            });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Verify OTP and change password
// @route   PUT /api/auth/change-password-with-otp
// @access  Private
exports.changePasswordWithOTP = async (req, res, next) => {
    try {
        const { otp, newPassword, confirmPassword } = req.body;

        if (!otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, error: 'Please provide OTP and new password' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, error: 'New passwords do not match' });
        }

        // Validate strong password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            const errors = Object.values(passwordValidation.errors).filter(err => err);
            return res.status(400).json({ 
                success: false, 
                error: errors.join('. ') 
            });
        }

        // Find user by ID with OTP
        const user = await User.findById(req.user.id).select('+changePasswordOTP +changePasswordOTPExpire +password');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Verify OTP
        if (user.changePasswordOTP !== otp || !user.changePasswordOTPExpire || user.changePasswordOTPExpire < Date.now()) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        // Check if new password is different from current
        const isSameAsCurrentPassword = await user.matchPassword(newPassword);
        if (isSameAsCurrentPassword) {
            return res.status(400).json({ success: false, error: 'New password must be different from current password' });
        }

        // Update password
        user.password = newPassword;
        user.changePasswordOTP = undefined;
        user.changePasswordOTPExpire = undefined;
        await user.save();

        // Send password change alert to admin email
        try {
            await sendAdminEmail({
                to: 'trendyadmin123@gmail.com',
                subject: '✅ Admin Password Changed Successfully - TrendyInterios',
                html: generatePasswordChangeAlertHTML({ name: user.name, email: user.email })
            });
        } catch (emailErr) {
            console.error('Failed to send password change alert:', emailErr);
        }

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (err) {
        next(err);
    }
};

// Helper
const sendTokenResponse = (user, statusCode, res) => {
    // FALLBACK SECRET for dev/testing if .env is missing/unreadable
    const secret = process.env.JWT_SECRET || 'fallback_dev_secret_key_12345';

    if (!process.env.JWT_SECRET) {
        console.warn('WARNING: JWT_SECRET is not defined/readable. Using fallback secret.');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    });
};
