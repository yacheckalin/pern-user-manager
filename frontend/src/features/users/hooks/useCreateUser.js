import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createNewUser } from '../api/users.api';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createNewUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  })
}