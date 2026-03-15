import React, { useState } from 'react';
import { FaPlus, FaTimes, FaTag } from 'react-icons/fa';
import './CategoryManager.css';

const CategoryManager = ({
    categories,
    selectedCategory,
    onSelectCategory,
    onAddCategory,
    onRemoveCategory
}) => {
    const [newCategoryInput, setNewCategoryInput] = useState('');
    const [showNewInput, setShowNewInput] = useState(false);

    const handleAddClick = () => {
        if (newCategoryInput.trim()) {
            const normalizedCategory = newCategoryInput.trim().toLowerCase();
            if (!categories.includes(normalizedCategory)) {
                onAddCategory(normalizedCategory);
                setNewCategoryInput('');
                setShowNewInput(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddClick();
        } else if (e.key === 'Escape') {
            setShowNewInput(false);
        }
    };

    return (
        <div className="category-manager">
            <div className="category-manager-header">
                <label className="category-label">
                    <FaTag /> Categories
                </label>
            </div>

            <div className="categories-container">
                {categories && categories.length > 0 ? (
                    categories.map((category) => (
                        <div
                            key={category}
                            className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => onSelectCategory(category)}
                        >
                            <span className="category-name">{category}</span>
                            <button
                                type="button"
                                className="category-remove"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveCategory(category);
                                }}
                                title="Remove category"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-categories">No categories yet</p>
                )}
            </div>

            <div className="add-category-wrapper">
                {showNewInput ? (
                    <div className="new-category-input-group">
                        <input
                            type="text"
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="e.g., Bedroom Design"
                            className="new-category-input"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={handleAddClick}
                            className="btn-confirm-category"
                            title="Add category"
                        >
                            <FaPlus />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowNewInput(false);
                                setNewCategoryInput('');
                            }}
                            className="btn-cancel-category"
                            title="Cancel"
                        >
                            <FaTimes />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowNewInput(true)}
                        className="btn-add-new-category"
                    >
                        <FaPlus /> Add Category
                    </button>
                )}
            </div>

            <small className="category-hint">
                Click a tag to select it, or create a new category
            </small>
        </div>
    );
};

export default CategoryManager;
