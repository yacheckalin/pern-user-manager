import { useQueryClient, useMutation } from '@tanstack/react-query';
import { activateUserById } from '../api/users.api';

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => activateUserById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ["users"] })
    }
  })
}