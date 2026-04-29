import UserEditModal from "@entities/user/ui/user-edit-modal";
import UserCreateModal from "@entities/user/ui/user-create-modal";
import UserDeleteModal from "@entities/user/ui/user-delete-modal";
import UserActivateModal from "@entities/user/ui/user-activate-modal";
import UserChangePasswordModal from "@entities/user/ui/user-change-password-modal";
import UserLogoutModal from "@entities/user/ui/user-logout-modal";

const UserModalGroup = ({
  onClose,
  user = null,
  modals,
  actions: {
    handleActivateUser,
    handleChangePasswordUser,
    handleCreateUser,
    handleDeleteUser,
    handleEditUser,
    handleLogoutUser,
    handleLogoutSession,
  },
  mutations: {
    updateMutation,
    createUserMutation,
    activateMutation,
    deleleUserMutation,
    changePasswordMutation,
    logoutMutation,
    logoutSessionMutation,
  },
}) => {
  return (
    <>
      <UserEditModal
        isOpen={!!modals?.edit}
        user={user}
        onClose={() => onClose({ edit: null })}
        onSave={handleEditUser}
        isLoading={updateMutation?.isPending}
      />

      <UserChangePasswordModal
        isOpen={!!modals?.changePassword}
        user={user}
        onClose={() => onClose({ changePassword: null })}
        onSave={handleChangePasswordUser}
        isLoading={changePasswordMutation?.isPending}
      />

      <UserCreateModal
        isOpen={!!modals?.create}
        onSave={handleCreateUser}
        onClose={() => onClose({ create: null })}
        isLoading={createUserMutation?.isPending}
      />

      <UserDeleteModal
        isOpen={!!modals?.delete}
        user={user}
        onClose={() => onClose({ delete: null })}
        onSave={handleDeleteUser}
        isLoading={deleleUserMutation?.isPending}
      />
      <UserActivateModal
        isOpen={!!modals?.activate}
        user={user}
        onClose={() => onClose({ activate: null })}
        onSave={handleActivateUser}
        isLoading={activateMutation?.isPending}
      />

      {user && (
        <UserLogoutModal
          isOpen={!!modals?.logout}
          user={user}
          onClose={() => onClose({ logout: null })}
          onSave={handleLogoutUser}
          onSessionRevoke={handleLogoutSession}
          isLoading={
            logoutMutation?.isPending || logoutSessionMutation?.isPending
          }
        />
      )}
    </>
  );
};

export default UserModalGroup;
