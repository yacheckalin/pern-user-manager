import React from "react";
import "./styles/ConfirmModal.css";

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{description}</p>
        </div>
        <div className="modal-footer">
          <button
            className="btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
