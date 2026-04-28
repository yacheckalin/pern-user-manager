const UserActivateButton = ({ onCallback, icons, ...user }) => (
  <button
    className={`btn-icon ${user.isActive ? "text-danger" : "text-success"}`}
    title={user.isActive ? "Already Activated" : "Activate User"}
    onClick={onCallback}
    disabled={!!user.isActive}
  >
    {user.isActive ? icons.on : icons.off}
  </button>
);

export default UserActivateButton;
