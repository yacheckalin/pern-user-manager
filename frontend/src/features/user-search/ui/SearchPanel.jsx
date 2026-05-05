import Spinner from "@shared/ui/spinner";
import SearchComponent from "@shared/ui/search";
import { Search } from "lucide-react";
import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";
import { USER_SEARCH_DEBOUNCE_DEELAY } from "@features/user-search";

const SearchPanel = ({ isLoading, localFilters, onSearch }) => {
  const [search, setSearch] = useState(localFilters?.search ?? "");
  const debouncedSearch = useDebouncedCallback((val) => {
    onSearch(val);
  }, USER_SEARCH_DEBOUNCE_DEELAY);

  return (
    <>
      <div className="spinner-overlay">{isLoading && <Spinner />}</div>
      <SearchComponent
        placeholder="Search ..."
        type="text"
        value={search}
        icon={<Search className="search-icon" size={18} />}
        onChange={(e) => {
          setSearch(e.target.value);
          debouncedSearch(e.target.value);
        }}
      />
    </>
  );
};

export default SearchPanel;
