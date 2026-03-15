import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Toast.css';

const Toast = ({ 
    type = 'success', 
    message = '', 
    subtitle = '',
    onClose, 
    autoClose = true, 
    duration = 3000 
}) => {
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!autoClose) return;

        let timer;
        if (!isPaused) {
            timer = setTimeout(onClose, duration);
        }

        return () => clearTimeout(timer);
    }, [autoClose, duration, isPaused, onClose]);

    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheckCircle />;
            case 'error':
                return <FaExclamationCircle />;
            case 'warning':
                return <FaInfoCircle />;
            default:
                return <FaInfoCircle />;
        }
    };

    return (
        <div
            className={`toast toast-${type}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="toast-accent-bar"></div>
            
            <div className="toast-icon">
                {getIcon()}
            </div>
            
            <div className="toast-content">
                <div className="toast-message">
                    {message}
                </div>
                {subtitle && (
                    <div className="toast-subtitle">
                        {subtitle}
                    </div>
                )}
            </div>
            
            <button
                className="toast-close"
                onClick={onClose}
                aria-label="Close notification"
                title="Close"
            >
                <FaTimes />
            </button>
            
            <div 
                className="toast-progress" 
                style={{
                    '--duration': `${duration}ms`,
                    animationPlayState: isPaused ? 'paused' : 'running'
                }}
            ></div>
        </div>
    );
};

export default Toast;


