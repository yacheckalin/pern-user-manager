import Button from "@shared/ui/button";

const UserActivateButton = ({ onCallback, icons, ...user }) => (
  <Button
    className={`btn-icon ${user.isActive ? "text-danger" : "text-success"}`}
    title={user.isActive ? "Already Activated" : "Activate User"}
    callback={onCallback}
    disabled={!!user.isActive}
    icon={user.isActive ? icons.on : icons.off}
  />
);

export default UserActivateButton;
