import "./Spinner.css";

const SIZES = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

export const Spinner = ({ size = "md", label, fullPage = false }) => {
  const sizeClass = SIZES[size];

  const SpinnerElement = (
    <div className="spinner-container">
      <svg
        className={`spinner-circle spinner-circle--${sizeClass}`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="spinner-circle__track" cx="12" cy="12" r="9.5" />
        <path
          className="spinner-circle__arc"
          d="M12 2.5A9.5 9.5 0 0 1 21.5 12"
        />
      </svg>

      {label && <span className="spinner-label">{label}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="spinner-container--fullpage"
        role="status"
        aria-label={label ?? "Loading..."}
      >
        {SpinnerElement}
      </div>
    );
  }

  return (
    <div
      className="spinner-container--inline"
      role="status"
      aria-label={label ?? "Loading..."}
    >
      {SpinnerElement}
    </div>
  );
};
