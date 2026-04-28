const CreateToolbar = ({ onOpen, description, icon }) => (
  <div className="create-container">
    <div className="btn-primary " onClick={onOpen}>
      {icon}
      {description}
    </div>
  </div>
);

export default CreateToolbar;
