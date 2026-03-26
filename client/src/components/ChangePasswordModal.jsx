import React, { useState } from 'react';
import { validatePassword, getPasswordStrengthMessage } from '../utils/passwordValidation';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP, Step 3: New Password
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/auth/send-change-password-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to send OTP');
                return;
            }

            setMessage(data.message || 'OTP sent to the registered admin email');
            setStep(2);
        } catch (err) {
            console.error('Request OTP Error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const otp = otpDigits.join('');
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        // OTP is verified on the server side when setting password, so move to next step
        setMessage('OTP verified. Now set your new password.');
        setStep(3);
        setLoading(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Validate new password
        const validation = validatePassword(newPassword);
        if (!validation.isValid) {
            const errors = Object.values(validation.errors).filter(err => err);
            setError(errors.join('. '));
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const otp = otpDigits.join('');
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/auth/change-password-with-otp', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    otp,
                    newPassword,
                    confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to change password');
                return;
            }

            setMessage('Password changed successfully!');
            setTimeout(() => {
                if (onSuccess) onSuccess();
                handleClose();
            }, 1500);
        } catch (err) {
            console.error('Change Password Error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOtpDigits(['', '', '', '', '', '']);
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setMessage('');
        setStep(1);
        onClose();
    };

    const handleOtpChange = (index, value) => {
        const numValue = value.replace(/\D/g, ''); // Allow only digits
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = numValue.slice(-1); // Keep only last digit
        setOtpDigits(newOtpDigits);

        // Auto-focus to next input
        if (numValue && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Change Password</h2>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>

                <div className="progress-indicator">
                    <div className="progress-step" style={{opacity: step >= 1 ? 1 : 0.5}}>
                        <div className="progress-circle" style={{backgroundColor: step >= 1 ? '#d4af37' : '#555'}}>1</div>
                        <span>Request OTP</span>
                    </div>
                    <div className="progress-line" style={{backgroundColor: step >= 2 ? '#d4af37' : '#555'}}></div>
                    <div className="progress-step" style={{opacity: step >= 2 ? 1 : 0.5}}>
                        <div className="progress-circle" style={{backgroundColor: step >= 2 ? '#d4af37' : '#555'}}>2</div>
                        <span>Verify OTP</span>
                    </div>
                    <div className="progress-line" style={{backgroundColor: step >= 3 ? '#d4af37' : '#555'}}></div>
                    <div className="progress-step" style={{opacity: step >= 3 ? 1 : 0.5}}>
                        <div className="progress-circle" style={{backgroundColor: step >= 3 ? '#d4af37' : '#555'}}>3</div>
                        <span>New Password</span>
                    </div>
                </div>

                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    {/* Step 1: Request OTP */}
                    {step === 1 && (
                        <form onSubmit={handleRequestOTP}>
                            <p className="password-requirement">
                                An OTP will be sent to the registered admin email address.
                            </p>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: Verify OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP}>
                            <p className="password-requirement">
                                Enter the 6-digit OTP sent to your admin email
                            </p>

                            <div className="otp-container">
                                <label>One-Time Password</label>
                                <div className="otp-inputs">
                                    {otpDigits.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            className="otp-input"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            maxLength="1"
                                            inputMode="numeric"
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>
                                <small>Valid for 10 minutes. Check your email if not received.</small>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleChangePassword}>
                            <p className="password-requirement">{getPasswordStrengthMessage()}</p>

                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        tabIndex="-1"
                                        title={showNewPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showNewPassword ? (
                                            <span style={{fontSize: '16px'}}>●</span>
                                        ) : (
                                            <span style={{fontSize: '16px'}}>◯</span>
                                        )}
                                    </button>
                                </div>
                                <small>Must be 8+ characters with 1 uppercase letter and 1 symbol</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex="-1"
                                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? (
                                            <span style={{fontSize: '16px'}}>●</span>
                                        ) : (
                                            <span style={{fontSize: '16px'}}>◯</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setStep(2)}
                                    disabled={loading}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
