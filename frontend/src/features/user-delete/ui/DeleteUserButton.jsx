const DeleteUserButton = ({ onCallback, icon }) => (
  <button className="btn-icon btn-danger" onClick={onCallback} title="Delete">
    {icon}
  </button>
);
export default DeleteUserButton;
