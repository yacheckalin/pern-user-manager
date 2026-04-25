import { useState } from "react";
import { useDeleteUser } from "@features/users/hooks/useDeleteUser";
import { useUpdateUser } from "@features/users/hooks/useUpdateUser";
import { useActivateUser } from "@features/users/hooks/useActivateUser";
import { useChangePasswordUser } from "@features/users/hooks/useChangePasswordUser";
import { useCreateUser } from "@features/users/hooks/useCreateUser";
import { useUsers } from "@/features/users";
import { USER_ITEM_FADE_IN_TIMEOUT } from "@features/users/constants";

export const useUserPage = () => {
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

  const [activatedUser, setActivatedUser] = useState(null);
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

  return {
    /** data */
    data: data ?? [],
    isLoading,
    isError,
    error,

    /**filters */
    filters,

    /** edit user */
    selectedUser,
    setSelectedUser,
    handleEditUser,

    /** highlight updated row */
    highlightedUserId,
    setHighlightedUserId,

    /** activate user */
    activatedUser,
    setActivatedUser,
    handleActivateUser,

    /** delete user */
    deletedUser,
    setDeletedUser,
    handleDeleteUser,

    /** change password */
    changedUser,
    setChangedUser,
    handleChangePasswordUser,

    /** create user */
    createdUser,
    setCreatedUser,
    handleCreateUser,
  };
};
