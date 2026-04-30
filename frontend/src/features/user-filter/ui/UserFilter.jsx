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
              value={filters.activated}
              onChange={(e) => handleFilterChange("activated", e.target.value)}
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
                  checked={filters.logged === "true"}
                  onChange={() => handleFilterChange("logged", "true")}
                />
                Logged In
              </label>
              <label>
                <input
                  type="radio"
                  name="session"
                  checked={filters.logged === "false"}
                  onChange={() => handleFilterChange("logged", "false")}
                />
                Logged Out
              </label>
              <label>
                <input
                  type="radio"
                  name="session"
                  checked={filters.logged === null}
                  onChange={() => handleFilterChange("logged", null)}
                />
                All
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
