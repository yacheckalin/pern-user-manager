import { API_PREFIX } from "@constants";
import { api } from "@configs";

export const changeUserPassword = async ({ id, ...payload }) => {
  const response = await api.patch(`${API_PREFIX}/users/${id}/password`, {
    ...payload,
  });
  return {
    data: response.data,
    message: response.message,
  };
};
