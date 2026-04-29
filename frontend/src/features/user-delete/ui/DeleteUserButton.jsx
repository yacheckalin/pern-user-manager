import Button from "@shared/ui/button";

const DeleteUserButton = ({ onCallback, icon, ...props }) => (
  <Button
    className="btn-icon btn-danger"
    callback={onCallback}
    icon={icon}
    title="Delete User"
    {...props}
  />
);
export default DeleteUserButton;
