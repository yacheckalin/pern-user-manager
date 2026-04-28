import { API_PREFIX } from "@constants";
import { api } from "@configs";

export const logoutUserById = async ({ id, ...payload }) => {
  const response = await api.post(`${API_PREFIX}/users/${id}/logout`, {
    ...payload,
  });
  return {
    data: response.data,
    message: response.message,
  };
};
