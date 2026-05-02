import { getUserStatsByUserId } from "@features/user-stats";
import { useQuery } from "@tanstack/react-query";

export const useUsersStats = (filters) => {
  return useQuery({
    queryKey: ["users/stats", filters],
    queryFn: () =>
      getUserStatsByUserId(filters).then((r) => ({ items: r.data, total: r.total })),
    keepPreviousData: true,
  });
};
