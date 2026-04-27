import { useState } from "react";
import { X, UserPlus, Loader2 } from "lucide-react";

export const UserCreateNewModal = ({ onSave, onClose, isOpen }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    age: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError(null);

    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: "Passwords do not match" });
      setIsLoading(false);
    }

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      const newErrors = {};

      if (err.code === "INVALID_USERNAME") {
        newErrors.username = err.message;
      }
      if (
        err.code === "INVALID_PASSWORD" ||
        err.code === "INVALID_NEW_PASSWORD"
      ) {
        newErrors.password = err.message;
      }
      if (
        err.code === "INVALID_CONFIRM_PASSWORD" ||
        err.code === "NEW_PASSWORD_THE_SAME"
      ) {
        newErrors.confirm_password = err.message;
      }
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New User</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {generalError && <div className="general-error">{generalError}</div>}

        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "input-error" : ""}
              placeholder="johndoe"
              required
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              placeholder="example@mail.com"
              required
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? "input-error" : ""}
              placeholder="25"
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              required
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={errors.confirm_password ? "input-error" : ""}
              required
            />
            {errors.confirm_password && (
              <span className="error-message">{errors.confirm_password}</span>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="loader-icon" />
              ) : (
                <UserPlus size={18} />
              )}
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
