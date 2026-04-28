import { API_PREFIX } from "@constants";
import { api } from "@configs";

export const activateUserById = async ({ id }) => {
  const response = await api.patch(`${API_PREFIX}/users/${id}/activate`);
  return {
    data: response.data,
    message: response.message,
  };
};
