// import { UserTable } from "@features/users";
import ErrorState from "@shared/ui/error-state";
import Spinner from "@shared/ui/spinner";
import CreateToolbar from "@shared/ui/create-toolbar";
import { UserPlus } from "lucide-react";
import UserTable from "@entities/user/ui/user-table";
import UserModalGroup from "@entities/user/ui/user-modal-group";
import { useUserManagement } from "@features/users";
import { onlineUsers, notActive, activeUsers } from "@features/users";
import UserInfoPanel from "@entities/user/ui/user-info-panel";

const UserManagementPanel = () => {
  const {
    isLoading,
    isError,
    data,
    error,
    modals,
    setFilters,
    filters,
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
    handleLogoutSession,

    activateMutation,
    deleleUserMutation,
    createUserMutation,
    updateMutation,
    changePasswordMutation,
    logoutMutation,
    logoutSessionMutation,
  } = useUserManagement();

  const handleSearch = (data) => {
    setFilters((prev) => ({ ...prev, search: data.trim() }));
  };
  const onCallbackHandler = (info, modal) => {
    setSelectedUser(info);
    setModals({ [modal]: true });
  };
  return (
    <div className="page-container">
      <>
        {isError && (
          <ErrorState
            message={error?.message}
            code={error?.code}
            status={error?.status}
            details={error?.details}
          />
        )}
        {/* {!data?.items?.length && (
          <CreateToolbar
            description={"Create New User"}
            onOpen={() => setModals({ create: true })}
            icon={<UserPlus size={18} />}
          />
        )} */}
        <UserInfoPanel
          total={data?.items?.length || 0}
          online={data?.items?.length && onlineUsers(data.items)}
          onCreate={(info) => onCallbackHandler(info, "create")}
          notActive={data?.items?.length && notActive(data.items)}
          active={data?.items?.length && activeUsers(data.items)}
          onSearch={handleSearch}
          filters={filters}
          setFilters={setFilters}
        />

        <UserTable
          data={data?.items}
          highlightedId={highlightedId}
          onCreate={(info) => onCallbackHandler(info, "create")}
          onDelete={(info) => onCallbackHandler(info, "delete")}
          onEdit={(info) => onCallbackHandler(info, "edit")}
          onActivate={(info) => onCallbackHandler(info, "activate")}
          onLogout={(info) => onCallbackHandler(info, "logout")}
          onChangePassword={(info) => onCallbackHandler(info, "changePassword")}
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
            handleLogoutUser,
            handleLogoutSession,
          }}
          mutations={{
            updateMutation,
            createUserMutation,
            changePasswordMutation,
            activateMutation,
            deleleUserMutation,
            logoutMutation,
            logoutSessionMutation,
          }}
        />
      </>
    </div>
  );
};

export default UserManagementPanel;
