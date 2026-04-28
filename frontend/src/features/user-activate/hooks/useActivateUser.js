import { useQueryClient, useMutation } from "@tanstack/react-query";
import { activateUserById } from "@features/user-activate";
import { toast } from "react-toastify";

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => activateUserById(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKeys: ["users"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to activate user!");
    },
  });
};
