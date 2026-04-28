const EditUserButton = ({ onCallback, icon, title }) => (
  <button className="btn-icon" onClick={onCallback} title={title}>
    {icon}
  </button>
);

export default EditUserButton;
