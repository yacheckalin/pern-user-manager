import { useQueryClient, useMutation } from '@tanstack/react-query'
import { changeUserPassword } from '../api/users.api';

export const useChangePasswordUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => changeUserPassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  })
}