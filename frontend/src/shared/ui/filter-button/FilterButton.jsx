const FilterButton = ({
  children,
  activeCount,
  onToggle,
  icon,
  description,
}) => (
  <div className="filter-wrapper" style={{ position: "relative" }}>
    <button
      className={`btn-panel ${activeCount > 0 ? "active" : ""}`}
      onClick={onToggle}
    >
      {icon}
      {description}
      {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
    </button>

    {children}
  </div>
);

export default FilterButton;
