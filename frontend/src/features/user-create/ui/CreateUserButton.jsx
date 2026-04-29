import Button from "@shared/ui/button";

const CreateUserButton = ({ onCallback, icon, title }) => (
  <Button
    className={"btn-primary"}
    callback={onCallback}
    icon={icon}
    title={`Create New User`}
    text={title}
  />
);

export default CreateUserButton;
