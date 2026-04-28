import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createNewUser } from "@features/user-create";
import { toast } from "react-toastify";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createNewUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message);
    },
    onError: (data) => {
      toast.error(data.message || "Failed to create new user");
    },
  });
};
