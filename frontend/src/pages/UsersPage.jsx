import { useState } from "react";
import { UserTable, useUsers } from "@/features/users";
import { ErrorState } from "@shared/ErrorState";
import { Spinner } from "@shared/Spinner";
import { ConfirmModal } from "@shared/ConfirmModal";
import { UserEditModal } from "@features/users/components/UserEditModal";
import { useDeleteUser } from "@features/users/hooks/useDeleteUser";
import { useUpdateUser } from "@features/users/hooks/useUpdateUser";
import { useActivateUser } from "@features/users/hooks/useActivateUser";
import { USER_ITEM_FADE_IN_TIMEOUT } from "../features/users/constants";
import { UserChangePasswordModal } from "../features/users/components/UserChangePasswordModal";
import { useChangePasswordUser } from "../features/users/hooks/useChangePasswordUser";

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

  const [highlightedUserId, setHighlightedUserId] = useState(null);
  const handleEditUser = async (formData) => {
    try {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        ...formData,
      });

      setHighlightedUserId(selectedUser.id);
      setSelectedUser(null);
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        setHighlightedUserId(null);
      }, USER_ITEM_FADE_IN_TIMEOUT);
    }
  };

  const activateMutation = useActivateUser();
  const handleActivateUser = async ({ id }) => {
    try {
      await activateMutation.mutateAsync({
        id,
      });
      setHighlightedUserId(id);
      setSelectedUser(null);
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        setHighlightedUserId(null);
      }, USER_ITEM_FADE_IN_TIMEOUT);
    }
  };

  const [changedUser, setChangedUser] = useState(null);
  const changePasswordMutation = useChangePasswordUser();
  const handleChangePasswordUser = async (data) => {
    try {
      await changePasswordMutation.mutateAsync({
        id: changedUser.id,
        ...data,
      });
      setHighlightedUserId(changedUser.id);
      setChangedUser(null);
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        setHighlightedUserId(null);
      }, USER_ITEM_FADE_IN_TIMEOUT);
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
            onActivate={handleActivateUser}
            highlightedId={highlightedUserId}
            onChangePassword={(info) => setChangedUser(info)}
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
            onSave={handleEditUser}
            isLoading={updateMutation.isPending}
          />
          {changedUser?.id && (
            <UserChangePasswordModal
              isOpen={!!changedUser?.id}
              user={changedUser}
              onClose={() => setChangedUser(null)}
              onSave={handleChangePasswordUser}
              isLoading={changePasswordMutation.isPending}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
