import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserById } from "../api/users.api";
import { toast } from "react-toastify";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteUserById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.error("User was deleted successfully!");
    },
    onError: (data) => {
      toast.error(data.message || "Failed to delete user");
    },
  });
};
