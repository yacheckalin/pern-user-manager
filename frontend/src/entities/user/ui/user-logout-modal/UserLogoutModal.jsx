import { useState } from "react";
import { Loader2, X, LogOut, Monitor, Smartphone } from "lucide-react";
import { formatDate } from "@features/users/utils/user.helpers";
import "./UserLogoutModal.css";
import { useTokens } from "@features/user-logout";
import Spinner from "@shared/ui/spinner";
import UserTokenList from "./UserTokenList";

const UserLogoutModal = ({ isOpen, user, onSave, onClose }) => {
  const [errors, setErrors] = useState(null);
  const { data, isError, error, isLoading } = useTokens({ id: user?.id });
  if (!isOpen) return null;

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
    user && (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Revoke all sessions for: {user.username}</h2>
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
                  Please be carefull, this action cannot be undone for <br />
                  <strong>[ {user.username} ]</strong>
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

              {/* <div className="metadata-section">
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
              </div> */}
              {data && <UserTokenList data={data?.items} onDeleteCallback={(data) => {console.log(data)}} />}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="loader-icon" />
                ) : (
                  <LogOut size={18} />
                )}
                Revoke All Sessions
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default UserLogoutModal;
