import "./UserInfoPanel.css";
import { Filter, UserPlus, Search } from "lucide-react";
import Spinner from "@shared/ui/spinner";
import UserFilter from "@features/user-filter/ui";
import { useState, useEffect } from "react";
import CreateUserButton from "@features/user-create";
import { useDebouncedCallback } from "use-debounce";
import SearchPanel from "@shared/ui/search-panel";

const UserInfoPanel = ({
  filters,
  setFilters,
  total,
  online,
  onCreate,
  onSearch,
  active,
  notActive,
  isLoading,
  onFilter,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const [search, setSearch] = useState(localFilters.search ?? "");

  const handleFilterChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const debouncedSearch = useDebouncedCallback((val) => {
    onSearch(val);
  }, 600);

  // reset filters
  const resetFilters = () => {
    const cleared = {
      ...localFilters,
      age: null,
      activated: null,
      logged: null,
      createdAt: null,
    };
    const filteredFilters = Object.fromEntries(
      Object.entries(cleared).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "",
      ),
    );
    setLocalFilters(cleared);
    setFilters(filteredFilters);
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onFilter({ ...localFilters });
    setShowFilters(false);
  };

  const activeCount = Object.values(localFilters).filter(
    (v) => v != null && v !== "" && v !== undefined,
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
        <SearchPanel
          placeholder="Search ..."
          type="text"
          value={search}
          icon={<Search className="search-icon" size={18} />}
          onChange={(e) => {
            setSearch(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />

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
            filters={localFilters}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />
        </div>

        <CreateUserButton
          icon={<UserPlus size={18} />}
          title="Add User"
          onCallback={() => onCreate()}
        />
      </div>
    </div>
  );
};
export default UserInfoPanel;
