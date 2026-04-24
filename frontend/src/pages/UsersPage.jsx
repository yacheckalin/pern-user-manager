import { useState } from "react";
import { UserTable, useUsers } from "@/features/users";
import { ErrorState } from "@shared/ErrorState";
import { Spinner } from "@shared/Spinner";

const UsersPage = () => {
  const [filters] = useState({ page: 1, search: "", limit: 10, offset: 0 });
  const { data, isLoading, isError, error } = useUsers(filters);

  return (
    <div className="page-container">
      <h1>User Management</h1>

      {isLoading ? (
        <Spinner lable="Loading Users ..." />
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
          <UserTable users={data?.items} total={data?.total} />
        </>
      )}
    </div>
  );
};

export default UsersPage;
