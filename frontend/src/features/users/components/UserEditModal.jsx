import { useState, useEffect } from "react";
import "./UserEditModal.css";
import { Loader2, Pencil, X } from "lucide-react";

export const UserEditModal = ({ isOpen, user, onSave, onClose, isLoading }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        age: user.age || "",
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
      await onSave(formData);
      onClose();
    } catch (err) {
      const newErrors = {};

      if (err.code === "INVALID_AGE") {
        newErrors.age = err.message;
      }
      if (err.code === "EMAIL_TAKEN" || err.code === "INVALID_EMAIL") {
        newErrors.email = err.message;
      }
      if (err.code === "USERNAME_TAKEN" || err.code === "INVALID_USERNAME") {
        newErrors.username = err.message;
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
          <h2>Edit User</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        {generalError && <div className="general-error">{generalError}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className={`form-group ${errors.username ? "has-error" : ""}`}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className={`form-group ${errors.age ? "has-error" : ""}`}>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? "input-error" : ""}
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="loader-icon" />
              ) : (
                <Pencil size={18} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
