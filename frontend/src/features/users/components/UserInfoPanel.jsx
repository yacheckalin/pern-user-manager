import "./UserInfoPanel.css";
import { Filter, Search, UserPlus } from "lucide-react";
import { Spinner } from "@shared/Spinner";
import UserFilter from "@features/user-filter";
import { useState } from "react";

const UserInfoPanel = ({
  total,
  online,
  onCreate,
  active,
  notActive,
  isLoading,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    role: "",
    age: 18,
    isActive: "",
    hasActiveSession: "",
    createdAt: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    const cleared = {
      role: "",
      age: 18,
      isActive: "",
      hasActiveSession: "",
      createdAt: "",
    };
    setFilters(cleared);
    // onApplyFilters(cleared);
  };

  const applyFilters = () => {
    // onApplyFilters(filters); /
    setShowFilters(false);
  };

  const activeCount = Object.values(filters).filter(
    (v) => v !== "" && v !== 18,
  ).length;

  return (
    <div className="panel-container">
      <div className="panel-info">
        <span className="count-badge">{total}</span>
        <span className="text-muted">Users found</span>

        <div className="mini-stats">
          <span className="dot dot-success"></span> {online} Online
        </div>
        <div className="mini-stats active">
          <span className="dot dot-active"></span>
          {active} Active
        </div>
        <div className="mini-stats not-active">
          <span className="dot dot-not-active"></span>
          {notActive} Not Active Yet
        </div>
      </div>

      <div className="panel-actions">
        <div className="spinner-overlay">{isLoading && <Spinner />}</div>
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search by name or email..." />
        </div>

        <div className="filter-wrapper" style={{ position: "relative" }}>
          <button
            className={`btn-panel ${activeCount > 0 ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {activeCount > 0 && (
              <span className="filter-badge">{activeCount}</span>
            )}
          </button>

          <UserFilter
            showFilters={showFilters}
            filters={filters}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />
        </div>

        <button className=" btn-primary" onClick={() => onCreate()}>
          <UserPlus size={18} />
          Add User
        </button>
      </div>
    </div>
  );
};

export default UserInfoPanel;
