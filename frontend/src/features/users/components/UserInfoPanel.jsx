import "./UserInfoPanel.css";
import { Filter, Search, UserPlus } from "lucide-react";

const UserInfoPanel = ({ total, online, onCreate }) => {
  return (
    <div className="panel-container">
      <div className="panel-info">
        <span className="count-badge">{total}</span>
        <span className="text-muted">Users found</span>

        <div className="mini-stats">
          <span className="dot dot-success"></span> {online} Online
        </div>
      </div>

      <div className="panel-actions">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search by name or email..." />
        </div>

        <button className="btn-panel">
          <Filter size={18} />
          Filters
        </button>

        <button
          className="btn-panel btn-primary-action"
          onClick={() => onCreate()}
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>
    </div>
  );
};

export default UserInfoPanel;
