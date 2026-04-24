import { useState } from "react";
import { UserTable, useUsers } from "@/features/users";
import { ErrorState } from "@shared/ErrorState";
import { Spinner } from "@shared/Spinner";
import { ConfirmModal } from "@shared/ConfirmModal";

const UsersPage = () => {
  const [filters] = useState({ page: 1, search: "", limit: 10, offset: 0 });
  const { data, isLoading, isError, error } = useUsers(filters);
  const [userToDelete, setUserToDelete] = useState(null);
  const handleDelete = async () => {
    // await deleteMutation.mutateAsync(userToDelete);
    setUserToDelete(null);
  };

  console.log(userToDelete);
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
          <UserTable
            users={data?.items}
            total={data?.total}
            onDelete={(info) => setUserToDelete(info)}
          />
          <ConfirmModal
            isOpen={Boolean(userToDelete)}
            title="Delete User"
            description={`You can't UNDO this action. All data for user ${userToDelete?.username} will be removed!.`}
            onConfirm={handleDelete}
            onCancel={() => setUserToDelete(null)}
            // isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
