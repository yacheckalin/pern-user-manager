import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <div className="not-found-divider"></div>
        <h2 className="not-found-title">Oops! Page not found</h2>
        <p className="not-found-text">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="not-found-actions">
          <button className="btn-primary" onClick={() => navigate("/users")}>
            Back to Dashboard
          </button>
          <button className="btn-outline" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
