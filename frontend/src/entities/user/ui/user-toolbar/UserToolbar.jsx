import "./UserToolbar.css";
import { Filter, UserPlus } from "lucide-react";
import UserFilter from "@features/user-filter/ui";
import { useState, useEffect } from "react";
import CreateUserButton from "@features/user-create";
import UserStats from "@features/user-stats";
import SearchPanel from "../../../../features/user-search/ui";

const UserToolbar = ({
  filters,
  setFilters,
  total,
  online,
  founded,
  onCreate,
  onSearch,
  active,
  notActive,
  // isLoading,
  onFilter,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // const [search, setSearch] = useState(localFilters.search ?? "");

  const handleFilterChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  // const debouncedSearch = useDebouncedCallback((val) => {
  //   onSearch(val);
  // }, 600);

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
    setShowFilters(false);
  };

  const applyFilters = () => {
    const filteredFilters = Object.fromEntries(
      Object.entries(localFilters).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "",
      ),
    );
    setFilters(filteredFilters);
    onFilter({ ...filteredFilters });
    setShowFilters(false);
  };

  const activeCount = Object.values(localFilters).filter(
    (v) => v != null && v !== "" && v !== undefined,
  ).length;

  return (
    <div className="panel-container">
      <UserStats
        total={total}
        online={online}
        active={active}
        notActive={notActive}
        founded={founded}
      />

      <div className="panel-actions">
        <SearchPanel onSearch={onSearch} />

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
export default UserToolbar;
