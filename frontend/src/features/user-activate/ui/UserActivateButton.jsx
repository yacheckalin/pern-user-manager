import Button from "@shared/ui/button";

const UserActivateButton = ({ onCallback, icons, isActive }) => (
  <Button
    className={`btn-icon ${isActive ? "text-danger" : "text-success"}`}
    title={isActive ? "Already Activated" : "Activate User"}
    callback={onCallback}
    disabled={!!isActive}
    icon={isActive ? icons.on : icons.off}
  />
);

export default UserActivateButton;
