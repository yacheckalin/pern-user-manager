import { useQueryClient } from "@tanstack/react-query";
import { FALLBACK_ERROR, ERROR_MESSAGES } from "@constants";

export const ErrorState = ({
  message,
  code,
  queryKey,
  onRetry,
  status,
  details,
}) => {
  const queryClient = useQueryClient();

  const { title, description } =
    (code && ERROR_MESSAGES[code]) ?? FALLBACK_ERROR;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey });
    }
  };

  const canRetry = !!(onRetry || queryKey);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1rem",
        textAlign: "center",
        gap: "8px",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle
          cx="20"
          cy="20"
          r="19"
          stroke="var(--color-border-danger)"
          strokeWidth="1"
        />
        <path
          d="M20 11v11"
          stroke="var(--color-text-danger)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="27" r="1.5" fill="var(--color-text-danger)" />
      </svg>

      <p
        style={{
          margin: 0,
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: "var(--color-text-secondary)",
          maxWidth: "280px",
        }}
      >
        {message ?? description}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: "var(--color-text-secondary)",
          maxWidth: "280px",
        }}
      >
        {details ?? description}
      </p>

      {code && (
        <code
          style={{
            fontSize: "11px",
            color: "var(--color-text-tertiary)",
            background: "var(--color-background-secondary)",
            padding: "2px 8px",
            borderRadius: "var(--border-radius-md)",
          }}
        >
          {code}
        </code>
      )}
      {status && (
        <code
          style={{
            fontSize: "11px",
            color: "var(--color-text-tertiary)",
            background: "var(--color-background-secondary)",
            padding: "2px 8px",
            borderRadius: "var(--border-radius-md)",
          }}
        >
          {status}
        </code>
      )}

      {/* retry */}
      {canRetry && (
        <button
          onClick={handleRetry}
          style={{
            marginTop: "8px",
            fontSize: "13px",
            padding: "6px 16px",
            borderRadius: "var(--border-radius-md)",
            border: "0.5px solid var(--color-border-secondary)",
            background: "transparent",
            color: "var(--color-text-primary)",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
};
