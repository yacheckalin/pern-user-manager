import { UserEditModal } from "@features/users/components/UserEditModal";
import { UserChangePasswordModal } from "@features/users/components/UserChangePasswordModal";
import { UserCreateNewModal } from "@features/users/components/UserCreateNewModal";
import { UserDeleteModal } from "@features/users/components/UserDeleteModal";
import { UserActivateModal } from "@features/users/components/UserActivateStatusModal";
import { UserLogoutModal } from "@features/users/components/UserLogoutModal";

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
  },
  mutations: {
    updateMutation,
    createUserMutation,
    activateMutation,
    deleleUserMutation,
    changePasswordMutation,
    logoutMutation,
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

      <UserCreateNewModal
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

      <UserLogoutModal
        isOpen={!!modals?.logout}
        user={user}
        onClose={() => onClose({ logout: null })}
        onSave={handleLogoutUser}
        isLoading={logoutMutation?.isPending}
      />
    </>
  );
};

export default UserModalGroup;
