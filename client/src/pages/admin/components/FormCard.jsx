import React from 'react';
import './FormCard.css';

const FormCard = ({ title, icon, children, className = '' }) => {
    return (
        <div className={`form-card ${className}`}>
            <div className="form-card-header">
                {icon && <span className="form-card-icon">{icon}</span>}
                <h3 className="form-card-title">{title}</h3>
            </div>
            <div className="form-card-content">
                {children}
            </div>
        </div>
    );
};

export default FormCard;
