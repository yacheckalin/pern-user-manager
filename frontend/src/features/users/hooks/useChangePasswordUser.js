import { useQueryClient, useMutation } from "@tanstack/react-query";
import { changeUserPassword } from "../api/users.api";
import { toast } from "react-toastify";

export const useChangePasswordUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => changeUserPassword(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to updated password");
    },
  });
};
