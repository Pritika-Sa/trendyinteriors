import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
    const ADMIN_EMAIL = 'trendyadmin123@gmail.com';
    const [step, setStep] = useState(2); // Start at step 2: OTP verification (step 1 is skipped)
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: ADMIN_EMAIL })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to send OTP');
                return;
            }

            setMessage(data.message || 'OTP sent to the registered admin email');
            setOtpSent(true);
        } catch (err) {
            console.error('Send OTP Error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const otp = otpDigits.join('');
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/auth/verify-reset-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: ADMIN_EMAIL, otp })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to verify OTP');
                return;
            }

            setMessage(data.message || 'OTP verified successfully');
            setResetToken(data.resetToken);
            setOtpDigits(['', '', '', '', '', '']);
            setStep(3);
        } catch (err) {
            console.error('Verify OTP Error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!newPassword || !confirmPassword) {
            setError('Please provide both passwords');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://trendyinteriors-1.onrender.com/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetToken, password: newPassword, confirmPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to reset password');
                return;
            }

            setMessage(data.message || 'Password reset successfully');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Reset Password Error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        const numValue = value.replace(/\D/g, '');
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = numValue.slice(-1);
        setOtpDigits(newOtpDigits);

        if (numValue && index < 5) {
            document.getElementById(`forgot-otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            document.getElementById(`forgot-otp-${index - 1}`)?.focus();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Reset Admin Password</h2>
                    {!otpSent && <p className="auth-subtitle">Send OTP to your admin email</p>}
                    {otpSent && step === 2 && <p className="auth-subtitle">Enter OTP sent to admin email</p>}
                    {step === 3 && <p className="auth-subtitle">Create a new password</p>}
                </div>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                {/* Step 1: Send OTP Request */}
                {!otpSent && (
                    <form className="auth-form" onSubmit={handleSendOTP}>
                        <div style={{padding: '16px', backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(212, 175, 55, 0.3)'}}>
                            <p style={{margin: 0, color: '#ffb84d', fontSize: '14px', lineHeight: '1.6'}}>
                                An OTP will be sent to <strong>{ADMIN_EMAIL}</strong>
                            </p>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>

                        <Link to="/login" style={{display: 'block', textAlign: 'center', marginTop: '15px', color: '#999', textDecoration: 'none', fontSize: '14px'}}>
                            Back to Login
                        </Link>
                    </form>
                )}

                {/* Step 2: OTP Verification */}
                {otpSent && step === 2 && (
                    <form className="auth-form" onSubmit={handleVerifyOTP}>
                        <div style={{marginBottom: '20px'}}>
                            <label style={{display: 'block', color: '#d4af37', marginBottom: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                                One-Time Password
                            </label>
                            <div style={{display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px'}}>
                                {otpDigits.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`forgot-otp-${index}`}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        maxLength="1"
                                        inputMode="numeric"
                                        autoFocus={index === 0}
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            textAlign: 'center',
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            border: '2px solid #d4af37',
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(15, 18, 20, 0.9)',
                                            color: '#fff',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                ))}
                            </div>
                            <small style={{display: 'block', color: '#999', fontSize: '12px', textAlign: 'center'}}>
                                Valid for 10 minutes. Check your email if not received.
                            </small>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Verifying OTP...' : 'Verify OTP'}
                        </button>

                        <button 
                            type="button" 
                            className="auth-link" 
                            onClick={() => {
                                setOtpSent(false);
                                setOtpDigits(['', '', '', '', '', '']);
                            }}
                            style={{ marginTop: '10px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                        >
                            Send OTP Again
                        </button>
                    </form>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <form className="auth-form" onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="Enter new password"
                                    style={{paddingRight: '45px'}}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        color: '#d4af37',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '6px 8px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                                    onMouseLeave={(e) => e.target.style.color = '#d4af37'}
                                    tabIndex="-1"
                                    title={showNewPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showNewPassword ? '●' : '◯'}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Confirm password"
                                    style={{paddingRight: '45px'}}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        color: '#d4af37',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '6px 8px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#fff'}
                                    onMouseLeave={(e) => e.target.style.color = '#d4af37'}
                                    tabIndex="-1"
                                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? '●' : '◯'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <Link to="/login" className="auth-link">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
