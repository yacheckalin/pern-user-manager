import { useState, useEffect } from "react";
import { useTokens } from "@features/user-logout";
import { Loader2, LogOut, Monitor } from "lucide-react";
import Button from "@shared/ui/button/Button";
import { delay, USER_SPINNER_DELAY } from "@features/users";

const UserSessionList = ({ userId, onSessionRevoke, onError, onLoad }) => {
  const [revokingId, setRevokingId] = useState(null);
  const [removingIds, setRemovingIds] = useState(new Set());

  const { data: tokens, isError, isLoading, error } = useTokens({ id: userId });

  useEffect(() => {
    if (isError) onError(error?.message);
  }, [isError]);

  useEffect(() => {
    if (tokens?.items !== undefined) {
      onLoad(tokens.items.length);
    }
  }, [tokens?.items?.length]);

  const handleRevokeSession = async (tokenId) => {
    if (revokingId) return;
    setRevokingId(tokenId);
    try {
      await onSessionRevoke({ userId, tokenId });
      await delay(USER_SPINNER_DELAY);
      setRemovingIds((prev) => new Set(prev).add(tokenId));
      setTimeout(() => {
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(tokenId);
          return next;
        });
      }, 1500);
    } catch (err) {
      onError(err.message);
    } finally {
      setRevokingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="sessions-loading">
        <Loader2 className="loader-icon spin" size={20} />
        <span>Loading sessions...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="sessions-error">Failed to load sessions</div>;
  }

  if (!tokens?.items?.length) {
    return <div className="sessions-empty">No active sessions</div>;
  }

  return (
    <>
      <div className="action-section logout-devices">
        {tokens?.items.map((token) => (
          <div
            key={token.id}
            className={`action-row ${removingIds.has(token.id) ? "removing" : ""}`}
          >
            <div className="device-info">
              <div className="device-icon">
                <Monitor size={20} />
              </div>
              <div className="device-details">
                <div className="meta-info">
                  <span>{token.ipAddress}</span>
                  <span className="dot-separator">•</span>
                  <span>{token.lastUsed}</span>
                </div>
              </div>
            </div>

            <div className="device-stats">
              <span className="stats-badge">
                {token.loginsThisMonth} logins this month
              </span>
            </div>

            <div className="device-actions">
              <Button
                className={`btn-logout-device`}
                title="Revoke access"
                disabled={!!revokingId}
                callback={() => handleRevokeSession(token.id)}
                icon={
                  revokingId === token.id ? (
                    <Loader2 className="loader-icon spin" size={16} />
                  ) : (
                    <>
                      <LogOut size={16} />
                    </>
                  )
                }
                text={<span>Logout</span>}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserSessionList;
