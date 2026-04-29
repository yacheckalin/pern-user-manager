import Button from "@shared/ui/button";

const EditUserButton = ({ onCallback, icon, ...props }) => (
  <Button
    className={`btn-icon`}
    callback={onCallback}
    title={`Edit User`}
    icon={icon}
    {...props}
  />
);

export default EditUserButton;
