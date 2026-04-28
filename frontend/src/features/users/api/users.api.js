import { API_PREFIX } from "@constants";
import { api } from "@configs";

export const getUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  role = "",
}) => {
  const response = await api.get(`${API_PREFIX}/users`, {
    params: { _page: page, _limit: limit, q: search, role },
  });
  const total = parseInt(response.headers["x-total-count"] || 0);
  return {
    data: response.data,
    total,
    message: response.message,
  };
};
