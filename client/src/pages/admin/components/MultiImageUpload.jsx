import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaPlus } from 'react-icons/fa';
import './MultiImageUpload.css';

const MultiImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [useURL, setUseURL] = useState(true);
    const [urlInput, setUrlInput] = useState('');

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
        if (files && files.length > 0) {
            const newImages = [...images];
            for (let i = 0; i < files.length && newImages.length < maxImages; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newImage = event.target.result;
                    if (!newImages.includes(newImage)) {
                        newImages.push(newImage);
                        if (newImages.length <= maxImages) {
                            onImagesChange(newImages);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages = [...images];
            for (let i = 0; i < files.length && newImages.length < maxImages; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newImage = event.target.result;
                    if (!newImages.includes(newImage)) {
                        newImages.push(newImage);
                        if (newImages.length <= maxImages) {
                            onImagesChange(newImages);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleAddURL = () => {
        if (urlInput.trim() && images.length < maxImages) {
            if (!images.includes(urlInput.trim())) {
                onImagesChange([...images, urlInput.trim()]);
                setUrlInput('');
            }
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const handleClickUpload = () => {
        document.querySelector('.multi-image-upload .file-input')?.click();
    };

    const canUploadMore = images.length < maxImages;

    return (
        <div className="multi-image-upload">
            {/* Uploaded Images Grid */}
            {images.length > 0 && (
                <div className="uploaded-images-grid">
                    <h5 className="grid-title">
                        Gallery Images ({images.length}/{maxImages})
                    </h5>
                    <div className="images-gallery">
                        {images.map((img, index) => (
                            <div key={index} className="gallery-item">
                                <img src={img} alt={`Gallery ${index + 1}`} />
                                <div className="image-number">{index + 1}</div>
                                <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => removeImage(index)}
                                    title="Remove image"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Section */}
            {canUploadMore && (
                <div className="upload-section">
                    <div className="upload-tabs">
                        <button
                            type="button"
                            className={`tab-btn ${useURL ? 'active' : ''}`}
                            onClick={() => setUseURL(true)}
                        >
                            📁 Upload Files
                        </button>
                        <button
                            type="button"
                            className={`tab-btn ${!useURL ? 'active' : ''}`}
                            onClick={() => setUseURL(false)}
                        >
                            🔗 Paste URL
                        </button>
                    </div>

                    {useURL ? (
                        <div className="upload-input-wrapper">
                            <div
                                className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleClickUpload}
                            >
                                <FaCloudUploadAlt className="upload-icon" />
                                <h4 className="upload-title">Drag & drop images here</h4>
                                <p className="upload-subtitle">or click to browse files</p>
                                <p className="upload-info">
                                    Add up to {maxImages - images.length} more {maxImages - images.length === 1 ? 'image' : 'images'}
                                </p>
                                <p className="upload-formats">Supported: JPG, PNG, WebP (Max 5MB each)</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="file-input"
                                    multiple
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="url-input-section">
                            <p className="url-section-title">Paste image URL</p>
                            <div className="url-input-group">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="url-input"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleAddURL();
                                    }}
                                />
                                <button
                                    type="button"
                                    className="add-url-btn"
                                    onClick={handleAddURL}
                                    disabled={!urlInput.trim()}
                                >
                                    <FaPlus /> Add
                                </button>
                            </div>
                            <small className="url-hint">Direct image links from Unsplash, Pexels, or verified URLs</small>
                        </div>
                    )}
                </div>
            )}

            {/* Full Gallery Message */}
            {!canUploadMore && (
                <div className="gallery-full">
                    <p>📸 You've added {maxImages} images (maximum reached)</p>
                </div>
            )}

            {/* Info Message */}
            {images.length === 0 && (
                <div className="info-message">
                    <FaPlus className="info-icon" />
                    <p>Add up to {maxImages} images for your project gallery</p>
                    <small>These images will be shown in a slideshow when customers view your project</small>
                </div>
            )}
        </div>
    );
};

export default MultiImageUpload;
