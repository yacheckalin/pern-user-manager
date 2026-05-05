// import { UserTable } from "@features/users";
import ErrorState from "@shared/ui/error-state";
import UserTable from "@entities/user/ui/user-table";
import UserModalGroup from "@entities/user/ui/user-modal-group";
import { useUserManagement } from "@features/users";
import { onlineUsers, notActive, activeUsers } from "@features/users";
import UserToolbar from "@entities/user/ui/user-toolbar";
import { useCallback } from "react";

const UserManagementPanel = () => {
  const {
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

  const handleSearch = useCallback((data) => {
    setFilters((prev) => ({ ...prev, search: data.trim() }));
  }, []);
  const handleFilters = useCallback((filters) => {
    if (filters) {
      setFilters((prev) => ({ ...prev, ...filters }));
    }
  }, []);

  const onCallbackHandler = useCallback((info, modal) => {
    setSelectedUser(info);
    setModals({ [modal]: true });
  }, []);
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
        <UserToolbar
          total={data?.total || 0}
          founded={data?.items?.length || 0}
          onCreate={(info) => onCallbackHandler(info, "create")}
          notActive={data?.items?.length && notActive(data.items)}
          online={data?.items?.length && onlineUsers(data.items)}
          active={data?.items?.length && activeUsers(data.items)}
          onSearch={handleSearch}
          filters={filters}
          setFilters={setFilters}
          onFilter={handleFilters}
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
