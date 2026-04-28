// import { UserTable } from "@features/users";
import ErrorState from "@shared/ui/error-state";
import Spinner from "@shared/ui/spinner";
import CreateToolbar from "@shared/ui/create-toolbar";
import { UserPlus } from "lucide-react";
import UserTable from "@entities/user/ui/user-table";
import UserModalGroup from "@entities/user/ui/user-modal-group";
import { useUserManagement } from "@features/users";

const UserManagementPanel = () => {
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
    handleLogoutUser,

    activateMutation,
    deleleUserMutation,
    createUserMutation,
    updateMutation,
    changePasswordMutation,
    logoutMutation,
  } = useUserManagement();

  const onCallbackHandler = (info, modal) => {
    setSelectedUser(info);
    setModals({ [modal]: true });
  };
  return (
    <div className="page-container">
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
          {!data?.items?.length && (
            <CreateToolbar
              description={"Create New User"}
              onOpen={() => setModals({ create: true })}
              icon={<UserPlus size={18} />}
            />
          )}
          {data?.items.length > 0 && (
            <UserTable
              data={data?.items}
              highlightedId={highlightedId}
              onCreate={(info) => onCallbackHandler(info, "create")}
              onDelete={(info) => onCallbackHandler(info, "delete")}
              onEdit={(info) => onCallbackHandler(info, "edit")}
              onActivate={(info) => onCallbackHandler(info, "activate")}
              onLogout={(info) => onCallbackHandler(info, "logout")}
              onChangePassword={(info) =>
                onCallbackHandler(info, "changePassword")
              }
            />
          )}

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
              handleLogoutUser,
            }}
            mutations={{
              updateMutation,
              createUserMutation,
              changePasswordMutation,
              activateMutation,
              deleleUserMutation,
              logoutMutation,
            }}
          />
        </>
      )}
    </div>
  );
};

export default UserManagementPanel;
