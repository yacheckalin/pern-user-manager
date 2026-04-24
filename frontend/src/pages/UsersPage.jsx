import { useState } from "react";
import { UserTable, useUsers } from "@/features/users";
import { ErrorState } from "@shared/ErrorState";
import { Spinner } from "@shared/Spinner";
import { ConfirmModal } from "@shared/ConfirmModal";
import { UserEditModal } from "@features/users/components/UserEditModal";
import { useDeleteUser } from "@features/users/hooks/useDeleteUser";
import { useUpdateUser } from "@features/users/hooks/useUpdateUser";

const UsersPage = () => {
  const [filters] = useState({ page: 1, search: "", limit: 10, offset: 0 });
  const { data, isLoading, isError, error } = useUsers(filters);
  const [userToDelete, setUserToDelete] = useState(null);
  const deleteMutation = useDeleteUser();
  const handleDelete = async () => {
    await deleteMutation.mutateAsync(userToDelete);
    setUserToDelete(null);
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const updateMutation = useUpdateUser();

  const handleSaveUser = async (formData) => {
    try {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        ...formData,
      });

      setSelectedUser(null);
    } catch (error) {
      throw error;
      console.error("Failed to update user:", error);
    }
  };

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
            onEdit={(info) => setSelectedUser(info)}
          />
          <ConfirmModal
            isOpen={Boolean(userToDelete)}
            title="Delete User"
            description={`You can't UNDO this action. All data for user ${userToDelete?.username} will be removed!.`}
            onConfirm={handleDelete}
            onCancel={() => setUserToDelete(null)}
            isLoading={deleteMutation.isPending}
          />

          <UserEditModal
            isOpen={!!selectedUser}
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            // onSave={(data) =>
            //   updateMutation.mutate({ id: selectedUser.id, ...data })
            // }
            onSave={handleSaveUser}
            isLoading={updateMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
