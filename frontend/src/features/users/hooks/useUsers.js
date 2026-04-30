import { getUsers, USER_STALE_TIME } from "@features/users";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (filters) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () =>
      getUsers(filters).then((r) => ({ items: r.data, total: r.total })),
    keepPreviousData: true,
    staleTime: USER_STALE_TIME
  });
};
