import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserById } from "@features/user-edit";
import { toast } from "react-toastify";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateUserById(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to updated");
    },
  });
};
