const CreateUserButton = ({ onCallback, icon, title }) => (
  <button className=" btn-primary" onClick={onCallback}>
    {icon}
    {title}
  </button>
);

export default CreateUserButton;
