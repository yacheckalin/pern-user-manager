const UserChangePasswordButton = ({ onCallback, title, icon }) => (
  <button className="btn-icon text-success" title={title} onClick={onCallback}>
    {icon}
  </button>
);

export default UserChangePasswordButton;
