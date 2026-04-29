import Button from "@shared/ui/button";

const LogoutUserButton = ({ onCallback, icon, ...user }) => (
  <Button
    callback={onCallback}
    className="btn-icon btn-danger"
    title="Revoke Session"
    disabled={!user.hasActiveSession}
    icon={icon}
    {...user}
  />
);

export default LogoutUserButton;
