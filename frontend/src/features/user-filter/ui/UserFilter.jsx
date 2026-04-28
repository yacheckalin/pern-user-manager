import "./UserFilter.css";
import { Filter } from "lucide-react";

const UserFilter = ({
  filters,
  handleFilterChange,
  resetFilters,
  applyFilters,
  showFilters,
}) => {
  return (
    <div className="filter-container">
      {showFilters && (
        <div className="filter-dropdown">
          <div className="filter-group">
            <label>Role</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Age: {filters.age || 18}+</label>
            <input
              type="range"
              min="18"
              max="100"
              value={filters.age || 18}
              onChange={(e) => handleFilterChange("age", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Account Status</label>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange("isActive", e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Not Active</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Session</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="session"
                  checked={filters.hasActiveSession === "true"}
                  onChange={() =>
                    handleFilterChange("hasActiveSession", "true")
                  }
                />
                Logged In
              </label>
              <label>
                <input
                  type="radio"
                  name="session"
                  checked={filters.hasActiveSession === "false"}
                  onChange={() =>
                    handleFilterChange("hasActiveSession", "false")
                  }
                />
                Logged Out
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label>Created After</label>
            <input
              type="date"
              value={filters.createdAt || ""}
              onChange={(e) => handleFilterChange("createdAt", e.target.value)}
            />
          </div>
          <div className="filter-actions">
            <button className="btn-reset" onClick={resetFilters}>
              Reset
            </button>
            <button className="btn-apply" onClick={applyFilters}>
              <Filter size={18} />
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilter;
