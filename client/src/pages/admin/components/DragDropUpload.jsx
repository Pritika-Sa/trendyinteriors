import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import './DragDropUpload.css';

const DragDropUpload = ({ onImageUrlChange, imageUrl, label = 'Project Image' }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageUrlChange(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageUrlChange(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClickUpload = () => {
        document.getElementById('image-upload').click();
    };

    const clearImage = () => {
        onImageUrlChange('');
    };

    return (
        <div className="drag-drop-upload">
            {imageUrl ? (
                <div className="upload-preview">
                    <div className="preview-image-wrapper">
                        <img src={imageUrl} alt="Preview" className="preview-image" />
                        <button
                            type="button"
                            className="clear-image-btn"
                            onClick={clearImage}
                            title="Remove image"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    <div className="preview-actions">
                        <p className="preview-text">Image uploaded successfully</p>
                        <button
                            type="button"
                            className="change-image-btn"
                            onClick={clearImage}
                        >
                            Change Image
                        </button>
                    </div>
                </div>
            ) : (
                <div className="upload-input-wrapper">
                    <div
                        className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClickUpload}
                    >
                        <FaCloudUploadAlt className="upload-icon" />
                        <h4 className="upload-title">Drag & drop your image</h4>
                        <p className="upload-subtitle">or click to browse files</p>
                        <p className="upload-formats">Supported: JPG, PNG, WebP (Max 5MB)</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="file-input"
                            id="image-upload"
                        />
                    </div>

                    <div className="url-input-section">
                        <p className="url-section-title">Or paste an image URL</p>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => onImageUrlChange(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="url-input"
                        />
                        <small className="url-hint">Direct image links from Unsplash, Pexels, or verified URLs</small>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DragDropUpload;
