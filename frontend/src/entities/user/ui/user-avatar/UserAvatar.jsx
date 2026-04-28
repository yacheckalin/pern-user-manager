const UserAvatar = ({ username, hasActiveSession }) => (
  <div className="avatar-container">
    <div className="user-avatar">{username[0].toUpperCase()}</div>
    {hasActiveSession && (
      <span className="online-indicator" title="Active session">
        <span className="online-pulse"></span>
      </span>
    )}
  </div>
);
export default UserAvatar;
