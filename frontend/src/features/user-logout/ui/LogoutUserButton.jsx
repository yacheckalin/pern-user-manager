const LogoutUserButton = ({ onCallback, icon, ...user }) => (
  <button
    className="btn-icon btn-danger"
    title="Revoke Session"
    disabled={!user.hasActiveSession}
    onClick={onCallback}
  >
    {icon}
  </button>
);

export default LogoutUserButton;
