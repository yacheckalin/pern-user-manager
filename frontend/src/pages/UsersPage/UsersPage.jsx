import { UserTable } from "@features/users";
import { ErrorState } from "@shared/ErrorState";
import { Spinner } from "@shared/Spinner";
import { useUserPage } from "./useUserPage";

import { UserEditModal } from "@features/users/components/UserEditModal";
import { UserChangePasswordModal } from "@features/users/components/UserChangePasswordModal";
import { UserCreateNewModal } from "@features/users/components/UserCreateNewModal";
import { UserDeleteModal } from "@features/users/components/UserDeleteModal";
import { UserActivateModal } from "@features/users/components/UserActivateStatusModal";

const UsersPage = () => {
  const {
    isLoading,
    isError,
    data,
    error,

    highlightedId,
    selectedUser,
    changedUser,
    activatedUser,
    deletedUser,
    createdUser,

    setSelectedUser,
    setActivatedUser,
    setChangedUser,
    setCreatedUser,
    setDeletedUser,

    handleEditUser,
    handleActivateUser,
    handleChangePasswordUser,
    handleCreateUser,
    handleDeleteUser,

    activateMutation,
    deleleUserMutation,
    createUserMutation,
    updateMutation,
    changePasswordMutation,
  } = useUserPage();

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
            onActivate={(info) => setActivatedUser(info)}
            highlightedId={highlightedId}
            onChangePassword={(info) => setChangedUser(info)}
          />

          <UserEditModal
            isOpen={!!selectedUser}
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleEditUser}
            isLoading={updateMutation?.isPending}
          />

          <UserChangePasswordModal
            isOpen={!!changedUser?.id}
            user={changedUser}
            onClose={() => setChangedUser(null)}
            onSave={handleChangePasswordUser}
            isLoading={changePasswordMutation?.isPending}
          />

          <UserCreateNewModal
            isOpen={!!createdUser}
            onSave={handleCreateUser}
            onClose={() => setCreatedUser(null)}
            isLoading={createUserMutation?.isPending}
          />

          <UserDeleteModal
            isOpen={!!deletedUser}
            user={deletedUser}
            onClose={() => setDeletedUser(null)}
            onSave={handleDeleteUser}
            isLoading={deleleUserMutation?.isPending}
          />
          <UserActivateModal
            isOpen={!!activatedUser}
            user={activatedUser}
            onClose={() => setActivatedUser(null)}
            onSave={handleActivateUser}
            isLoading={activateMutation?.isPending}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
