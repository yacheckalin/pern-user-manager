import { UserTable, useUsers } from "@/features/users";
import { useState } from "react";

const UsersPage = () => {
  const [filters, setFilters] = useState({ page: 1, search: "" });
  const { data, isLoading, isError, error } = useUsers(filters);

  return (
    <div className="page-container">
      <h1>User Management</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isError && (
            <div>
              <div>{error?.message}</div>
              <div>{error?.status}</div>
              <div>{error?.code}</div>
              <div>{error?.details}</div>
            </div>
          )}
          <UserTable users={data} />
        </>
      )}
    </div>
  );
};

export default UsersPage;
