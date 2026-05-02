import { getUserStats } from "@features/user-stats";
import { USER_STALE_TIME } from "@features/users";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const useUsersStats = () => {
  return useQuery({
    queryKey: ["users-statistic"],
    queryFn: () => getUserStats().then((r) => r.data),
    placeholderData: keepPreviousData,
    staleTime: USER_STALE_TIME
  });
};
