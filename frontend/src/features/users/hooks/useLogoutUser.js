import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUserById } from "../api/users.api";
import { toast } from "react-toastify";

export const useLogoutUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => logoutUserById(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User logged out successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to logout");
    },
  });
};
