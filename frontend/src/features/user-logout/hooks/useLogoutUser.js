import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logoutUserById, logoutSessionByTokenId, getAllTokensByUserId } from "@features/user-logout";
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

export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => logoutSessionByTokenId(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKeys: ["tokens", "users"] });
      toast.success("User Loggout successfully from device ...");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to logout");
    },
  });
};

export const useTokens = (filters) => {
  return useQuery({
    queryKey: ["tokens", filters],
    queryFn: () =>
      getAllTokensByUserId(filters).then((r) => ({ items: r.data, total: r.total })),
    keepPreviousData: true,
    onError: (error) => {
      toast.error(error.message || 'Failed to load tokens')
    }
  });
}


