import { useState } from "react";
import { useDeleteUser } from "@features/user-delete";
import { useActivateUser } from "@features/user-activate";
import { useLogoutUser } from "@features/user-logout";
import { useUpdateUser } from "@features/user-edit";
import { useChangePasswordUser } from "@features/user-change-password";
import { useCreateUser } from "@features/user-create";

import { useUsers } from "@/features/users";
import { USER_ITEM_FADE_IN_TIMEOUT } from "@features/users/constants";
import { useFlashHighlight } from "./useFlashHighlight";

export const useUserManagement = () => {
  const [filters] = useState({ page: 1, search: "", limit: 10, offset: 0 });

  const { data, isLoading, isError, error } = useUsers(filters);
  const [highlightedId, triggerHighlight] = useFlashHighlight(
    USER_ITEM_FADE_IN_TIMEOUT || 3000,
  );
  const [modals, setModals] = useState({
    create: null,
    edit: null,
    changePassword: null,
    activate: null,
    delete: null,
    logout: null,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const updateMutation = useUpdateUser();

  const [highlightedUserId, setHighlightedUserId] = useState(null);
  const handleEditUser = async (formData) => {
    await updateMutation.mutateAsync({
      id: selectedUser.id,
      ...formData,
    });
    triggerHighlight(selectedUser.id);
    setSelectedUser(null);
  };

  const activateMutation = useActivateUser();
  const handleActivateUser = async ({ id }) => {
    await activateMutation.mutateAsync({
      id,
    });
    triggerHighlight(id);
    setSelectedUser(null);
  };

  const changePasswordMutation = useChangePasswordUser();
  const handleChangePasswordUser = async (data) => {
    await changePasswordMutation.mutateAsync({
      id: selectedUser?.id,
      ...data,
    });
    triggerHighlight(selectedUser?.id);
    setSelectedUser(null);
  };

  const [createdUser, setCreatedUser] = useState(null);
  const createUserMutation = useCreateUser();
  const handleCreateUser = async (data) => {
    await createUserMutation.mutateAsync({
      ...data,
    });
    triggerHighlight(data.id);
  };

  const deleleUserMutation = useDeleteUser();
  const handleDeleteUser = async (data) => {
    await deleleUserMutation.mutateAsync(data);
    setSelectedUser(null);
  };

  const logoutMutation = useLogoutUser();
  const handleLogoutUser = async (data) => {
    await logoutMutation.mutateAsync(data);
    setSelectedUser(null);
  };

  return {
    /** data */
    data: data ?? [],
    isLoading,
    isError,
    error,

    /**filters */
    filters,

    /** modals state */
    modals,
    setModals,

    /** edit user */
    selectedUser,
    setSelectedUser,
    handleEditUser,

    /** highlight updated row */
    highlightedUserId,
    setHighlightedUserId,

    /** activate user */
    handleActivateUser,

    /** delete user */
    handleDeleteUser,

    /** change password */
    handleChangePasswordUser,

    /** logout user by id */
    handleLogoutUser,

    /** create user */
    createdUser,
    setCreatedUser,
    handleCreateUser,
    highlightedId,
    triggerHighlight,
  };
};
