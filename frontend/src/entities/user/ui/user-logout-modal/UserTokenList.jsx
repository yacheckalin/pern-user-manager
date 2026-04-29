import { Monitor, LogOut } from "lucide-react";
import Button from "@shared/ui/button";

const UserTokenList = ({ data, onDeleteCallback }) => (
  <div className="action-section logout-devices">
    <h3 className="section-title">Active Sessions</h3>

    {data.map((item) => (
      <div className="action-row" key={item.hash}>
        <div className="device-info">
          <div className="device-icon">
            <Monitor size={20} />
          </div>
          <div className="device-details">
            <div className="meta-info">
              <span>{item.ipAddress}</span>
              <span className="dot-separator">•</span>
              <span>2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="device-stats">
          <span className="stats-badge">14 logins this month</span>
        </div>

        <div className="device-actions">
          <Button
            className={`btn-logout-device`}
            title="Revoke access"
            icon={<LogOut size={16} />}
            text={<span>Logout</span>}
            callback={() => onDeleteCallback(item.id)}
          />
          {/* <button className="btn-logout-device" title="Revoke access">
            <LogOut size={16} />
            <span>Logout</span>
          </button> */}
        </div>
      </div>
    ))}
  </div>
);

export default UserTokenList;
