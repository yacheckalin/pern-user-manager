import { useState } from "react";
import { UserTable, useUsers } from "@/features/users";
import { ErrorState } from "@shared/ErrorState";
import { Spinner } from "@shared/Spinner";
import { UserEditModal } from "@features/users/components/UserEditModal";
import { useDeleteUser } from "@features/users/hooks/useDeleteUser";
import { useUpdateUser } from "@features/users/hooks/useUpdateUser";
import { useActivateUser } from "@features/users/hooks/useActivateUser";
import { USER_ITEM_FADE_IN_TIMEOUT } from "@features/users/constants";
import { UserChangePasswordModal } from "@features/users/components/UserChangePasswordModal";
import { useChangePasswordUser } from "@features/users/hooks/useChangePasswordUser";
import { UserCreateNewModal } from "@features/users/components/UserCreateNewModal";
import { useCreateUser } from "../features/users/hooks/useCreateUser";
import { UserDeleteModal } from "../features/users/components/UserDeleteModal";

const UsersPage = () => {
  const [filters] = useState({ page: 1, search: "", limit: 10, offset: 0 });

  const { data, isLoading, isError, error } = useUsers(filters);

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

  const [createdUser, setCreatedUser] = useState(null);
  const createUserMutation = useCreateUser();
  const handleCreateUser = async (data) => {
    try {
      const response = await createUserMutation.mutateAsync({
        ...data,
      });
      setChangedUser(null);
      setHighlightedUserId(response.data.id);
    } catch (e) {
      throw e;
    } finally {
      setTimeout(() => {
        setHighlightedUserId(null);
      }, USER_ITEM_FADE_IN_TIMEOUT);
    }
  };

  const [deletedUser, setDeletedUser] = useState(null);
  const deleleUserMutation = useDeleteUser();
  const handleDeleteUser = async (data) => {
    try {
      await deleleUserMutation.mutateAsync(data);
    } catch (e) {
      throw e;
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
          <div className="btn-primary " onClick={() => setCreatedUser(true)}>
            Create New User
          </div>
          <UserTable
            users={data?.items}
            total={data?.total}
            onDelete={(info) => setDeletedUser(info)}
            onEdit={(info) => setSelectedUser(info)}
            onActivate={handleActivateUser}
            highlightedId={highlightedUserId}
            onChangePassword={(info) => setChangedUser(info)}
          />

          <UserEditModal
            isOpen={!!selectedUser}
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleEditUser}
            isLoading={updateMutation.isPending}
          />

          <UserChangePasswordModal
            isOpen={!!changedUser?.id}
            user={changedUser}
            onClose={() => setChangedUser(null)}
            onSave={handleChangePasswordUser}
            isLoading={changePasswordMutation.isPending}
          />

          {createdUser && (
            <UserCreateNewModal
              onSave={handleCreateUser}
              onClose={() => setCreatedUser(null)}
              isLoading={createUserMutation.isPending}
            />
          )}
          <UserDeleteModal
            isOpen={!!deletedUser}
            user={deletedUser}
            onClose={() => setDeletedUser(null)}
            onSave={handleDeleteUser}
            isLoading={deleleUserMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
