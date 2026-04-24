import {
  UserTable,
  UserFilters,
  // UserPagination,
  useUsers,
} from "@/features/users";
import { useState } from "react";

const UsersPage = () => {
  const [filters, setFilters] = useState({ page: 1, search: "" });

  // Вся сложная логика запроса скрыта в хуке фичи
  const { data, isLoading } = useUsers(filters);

  return (
    <div className="page-container">
      <h1>Управление пользователями</h1>
      <UserFilters
        values={filters}
        onChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
      />

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <UserTable users={data.items} />
          {/* <UserPagination
            current={filters.page}
            total={data.totalPages}
            onChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          /> */}
        </>
      )}
    </div>
  );
};

export default UsersPage;
