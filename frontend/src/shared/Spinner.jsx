const SIZES = {
  sm: 16,
  md: 28,
  lg: 44,
};

export const Spinner = ({ size = "md", label, fullPage = false }) => {
  const px = SIZES[size];

  const spinner = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: "spin 0.8s linear infinite" }}
        aria-hidden="true"
      >
        {/* трек */}
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="var(--color-border-secondary)"
          strokeWidth="1.5"
        />
        {/* дуга */}
        <path
          d="M12 2.5A9.5 9.5 0 0 1 21.5 12"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {label && (
        <span
          style={{
            fontSize: "13px",
            color: "var(--color-text-tertiary)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-background-primary)",
          zIndex: 50,
        }}
        role="status"
        aria-label={label ?? "Loading"}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1rem",
        width: "100%",
      }}
      role="status"
      aria-label={label ?? "Loading"}
    >
      {spinner}
    </div>
  );
};
