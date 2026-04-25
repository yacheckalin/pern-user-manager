import React, { useState } from "react";
import "./UserDeleteModal.css";
import { Loader2, X, Trash2 } from "lucide-react";
import { formatDate } from "../utils/user.helpers";

export const UserDeleteModal = ({
  isOpen,
  user,
  onSave,
  onClose,
  isLoading,
}) => {
  if (!isOpen) return null;
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    setErrors(null);
    e.preventDefault();
    try {
      await onSave({ id: user.id });
      onClose();
    } catch (err) {
      setErrors(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete User {user.username}</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        {errors && <div className="general-error">{errors}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="confirm-delete-container">
            <div className="alert-banner">
              <span className="alert-icon">⚠️</span>
              <p>
                Are you sure you want to delete <strong>{user.username}</strong>
                ? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="user-details-grid">
              <div className="detail-item">
                <span className="detail-label">ID</span>
                <span className="detail-value mono">#{user.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span
                  className={`status-pill ${user.isActive ? "active" : "inactive"}`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Age</span>
                <span className="detail-value">{user.age || "-"}</span>
              </div>
            </div>

            <div className="metadata-section">
              <div className="meta-row">
                <span>Created:</span>{" "}
                <strong>{formatDate(user.createdAt)}</strong>
              </div>
              <div className="meta-row">
                <span>Updated:</span>{" "}
                <strong>{formatDate(user.updatedAt)}</strong>
              </div>
              <div className="meta-row">
                <span>Activated:</span>{" "}
                <strong>{formatDate(user.activatedAt)}</strong>
              </div>
              <div className="meta-row">
                <span>Last Login:</span>{" "}
                <strong>{formatDate(user.lastLogin)}</strong>
              </div>
              {user.isActive && (
                <div className="meta-row">
                  <span>Activated:</span>{" "}
                  <strong>{formatDate(user.activatedAt)}</strong>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="loader-icon" />
              ) : (
                <Trash2 size={18} />
              )}
              Confirm Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
