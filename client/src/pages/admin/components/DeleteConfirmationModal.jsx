import React, { useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({
  isOpen,
  title = 'Delete Item?',
  message = 'Are you sure? This action cannot be undone.',
  itemName = '',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onCancel}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrapper">
          <FaTrash className="modal-trash-icon" />
        </div>

        <h2 className="modal-title">{title}</h2>

        <p className="modal-message">
          {message}
          {itemName && <span className="item-name"> "{itemName}"</span>}
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-delete"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="btn-icon" />
                Yes, Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
