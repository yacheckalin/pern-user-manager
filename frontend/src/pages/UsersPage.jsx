import { UserTable, useUsers } from "@/features/users";
import { useState } from "react";

const UsersPage = () => {
  const [filters, setFilters] = useState({ page: 1, search: "" });

  // Вся сложная логика запроса скрыта в хуке фичи
  const {
    data: { data },
    isLoading,
  } = useUsers(filters);
  return (
    <div className="page-container">
      <h1>User Management</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <UserTable users={data} />
        </>
      )}
    </div>
  );
};

export default UsersPage;
