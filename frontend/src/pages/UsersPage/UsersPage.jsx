import { UserTable } from "@features/users";
import { ErrorState } from "@shared/ErrorState";
import { Spinner } from "@shared/Spinner";
import { useUserPage } from "./useUserPage";
import UserModalGroup from "./UserModalGroup";

const UsersPage = () => {
  const {
    isLoading,
    isError,
    data,
    error,
    modals,
    setModals,
    highlightedId,
    selectedUser,
    setSelectedUser,

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

  const onCallbackHandler = (info, modal) => {
    setSelectedUser(info);
    setModals({ [modal]: true });
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
          <div
            className="btn-primary "
            onClick={() => setModals({ create: true })}
          >
            Create New User
          </div>
          <UserTable
            users={data?.items}
            total={data?.total}
            onDelete={(info) => onCallbackHandler(info, "delete")}
            onEdit={(info) => onCallbackHandler(info, "edit")}
            onActivate={(info) => onCallbackHandler(info, "activate")}
            highlightedId={highlightedId}
            onChangePassword={(info) =>
              onCallbackHandler(info, "changePassword")
            }
          />

          <UserModalGroup
            user={selectedUser}
            modals={modals}
            onClose={(data) => setModals(data)}
            actions={{
              handleCreateUser,
              handleActivateUser,
              handleChangePasswordUser,
              handleDeleteUser,
              handleEditUser,
            }}
            mutations={{
              updateMutation,
              createUserMutation,
              changePasswordMutation,
              activateMutation,
              deleleUserMutation,
            }}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
