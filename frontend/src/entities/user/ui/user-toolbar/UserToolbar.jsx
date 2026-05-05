import "./UserToolbar.css";
import { Filter, UserPlus } from "lucide-react";
import UserFilter from "@features/user-filter/ui";
import { useState, useEffect, useMemo, useCallback } from "react";
import CreateUserButton from "@features/user-create";
import UserStats from "@features/user-stats";
import SearchPanel from "@features/user-search";
import FilterButton from "@shared/ui/filter-button";

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
  isLoading,
  onFilter,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

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

  const activeCount = useMemo(
    () =>
      Object.values(localFilters).filter(
        (v) => v != null && v !== "" && v !== undefined,
      ).length,
    [localFilters],
  );

  const handleCreate = useCallback(() => {
    onCreate();
  }, [onCreate]);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

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
        <SearchPanel onSearch={onSearch} isLoading={isLoading} />

        <FilterButton
          icon={<Filter size={18} />}
          description={"Filters"}
          onToggle={toggleFilters}
          activeCount={activeCount}
        >
          <UserFilter
            showFilters={showFilters}
            filters={localFilters}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />
        </FilterButton>

        <CreateUserButton
          icon={<UserPlus size={18} />}
          title="Add User"
          onCallback={handleCreate}
        />
      </div>
    </div>
  );
};
export default UserToolbar;
