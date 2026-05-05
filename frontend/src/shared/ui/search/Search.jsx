const Search = ({ onChange, value, icon, placeholder, type, className }) => (
  <div className="search-wrapper">
    {icon}
    <input
      className={className || ""}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);
export default Search;
