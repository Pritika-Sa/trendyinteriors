import React from 'react';
import { FaCrown } from 'react-icons/fa';
import './AdminHeader.css';

const AdminHeader = ({ userName = 'Admin' }) => {
    return (
        <div className="admin-header-container">
            <div className="admin-header-content">
                <div className="admin-header-title-section">
                    <div className="admin-header-icon">
                        <FaCrown />
                    </div>
                    <div className="admin-header-text">
                        <h1 className="admin-header-title">Admin Dashboard</h1>
                        <p className="admin-header-subtitle">Welcome back, {userName}</p>
                    </div>
                </div>
                <div className="admin-header-badge">
                    Control Panel
                </div>
            </div>
        </div>
    );
};

export default AdminHeader;
