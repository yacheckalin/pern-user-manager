import { getUsers } from "../api/users.api";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (filters) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => getUsers(filters).then(r => r.data),
    keepPreviousData: true,
  });
};