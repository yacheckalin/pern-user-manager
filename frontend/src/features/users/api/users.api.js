import { API_PREFIX } from "@constants";
import { api } from "@configs";

export const getUsers = async ({
  search = "",
  age,
  logged,
  activated,
  createdAt
}) => {
  const response = await api.get(`${API_PREFIX}/users`, {
    params: { s: search, age, logged, activated, createdAt },
  });
  const total = parseInt(response.headers["x-total-count"] || 0);

  return {
    data: response.data,
    total,
    message: response.message,
  };
};
