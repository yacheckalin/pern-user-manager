import { UserTable, useUsers } from "@/features/users";
import { useState } from "react";
import { ErrorState } from "../shared/ErrorState";

const UsersPage = () => {
  const [filters] = useState({ page: 1, search: "" });
  const { data, isLoading, isError, error } = useUsers(filters);

  return (
    <div className="page-container">
      <h1>User Management</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isError && (
            <ErrorState
              message={error?.message}
              code={error?.code}
              status={error?.status}
              details={error?.details}
            />
          )}
          <UserTable users={data} />
        </>
      )}
    </div>
  );
};

export default UsersPage;
