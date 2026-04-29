import Button from "@shared/ui/button";
const UserChangePasswordButton = ({ onCallback, icon }) => (
  <Button
    className={`btn-icon text-success`}
    title={`Change User Password`}
    callback={onCallback}
    icon={icon}
  />
);

export default UserChangePasswordButton;
