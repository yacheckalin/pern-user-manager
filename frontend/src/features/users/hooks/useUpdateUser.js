import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserById } from "../api/users.api";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateUserById(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
