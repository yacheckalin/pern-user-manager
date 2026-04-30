import Button from "@shared/ui/button";

const CreateUserButton = ({ onCallback, icon, title, style }) => (
  <Button
    className={"btn-primary"}
    callback={onCallback}
    icon={icon}
    title={`Create New User`}
    text={title}
    style={style}
  />
);

export default CreateUserButton;
