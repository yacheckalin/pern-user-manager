import Button from "@shared/ui/button";

const LogoutUserButton = ({ onCallback, icon, hasActiveSession }) => (
  <Button
    callback={onCallback}
    className="btn-icon btn-danger"
    title="Revoke Session"
    disabled={!hasActiveSession}
    icon={icon}
  />
);

export default LogoutUserButton;
