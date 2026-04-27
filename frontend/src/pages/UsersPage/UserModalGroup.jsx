import { UserEditModal } from "@features/users/components/UserEditModal";
import { UserChangePasswordModal } from "@features/users/components/UserChangePasswordModal";
import { UserCreateNewModal } from "@features/users/components/UserCreateNewModal";
import { UserDeleteModal } from "@features/users/components/UserDeleteModal";
import { UserActivateModal } from "@features/users/components/UserActivateStatusModal";

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
  },
  mutations: {
    updateMutation,
    createUserMutation,
    activateMutation,
    deleleUserMutation,
    changePasswordMutation,
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
    </>
  );
};

export default UserModalGroup;
