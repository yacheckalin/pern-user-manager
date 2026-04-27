import { useState, useEffect } from "react";
import "./UserEditModal.css";
import { KeyRound, Loader2, X } from "lucide-react";

export const UserChangePasswordModal = ({
  isOpen,
  user,
  onSave,
  onClose,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        old_password: user.old_password || "",
        new_password: user.new_password || "",
        confirm_password: user.confirm_password || "",
      });
      setErrors({});
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    setErrors({});
    setGeneralError(null);
    e.preventDefault();
    try {
      await onSave({ id: user.id, ...formData });
      onClose();
    } catch (err) {
      const newErrors = {};

      if (
        err.code === "INVALID_OLD_PASSWORD" ||
        err.code === "OLD_PASSWORD_INVALID"
      ) {
        newErrors.old_password = err.message;
      }
      if (err.code === "INVALID_NEW_PASSWORD") {
        newErrors.new_password = err.message;
      }
      if (
        err.code === "INVALID_CONFIRM_PASSWORD" ||
        err.code === "NEW_PASSWORD_THE_SAME"
      ) {
        newErrors.confirm_password = err.message;
      }
      if (err.fields) {
        Object.assign(newErrors, err.fields);
      }
      if (Object.keys(newErrors).length === 0) {
        newErrors.general = err.message || "Something went wrong";
        setGeneralError(err.message);
      }

      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Change User Password</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        {generalError && <div className="general-error">{generalError}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          <div
            className={`form-group ${errors.old_password ? "has-error" : ""}`}
          >
            <label htmlFor="username">Old Password</label>
            <input
              id="old_password"
              name="old_password"
              type="password"
              value={formData.old_password}
              onChange={handleChange}
              required
              className={errors.old_password ? "input-error" : ""}
            />
            {errors.old_password && (
              <span className="error-message">{errors.old_password}</span>
            )}
          </div>

          <div
            className={`form-group ${errors.new_password ? "has-error" : ""}`}
          >
            <label htmlFor="email">New Password</label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              value={formData.new_password}
              onChange={handleChange}
              required
              className={errors.new_password ? "input-error" : ""}
            />
            {errors.new_password && (
              <span className="error-message">{errors.new_password}</span>
            )}
          </div>

          <div
            className={`form-group ${errors.confirm_password ? "has-error" : ""}`}
          >
            <label htmlFor="age">Confirm Password</label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={errors.confirm_password ? "input-error" : ""}
            />
            {errors.confirm_password && (
              <span className="error-message">{errors.confirm_password}</span>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="loader-icon" />
              ) : (
                <KeyRound size={18} />
              )}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
