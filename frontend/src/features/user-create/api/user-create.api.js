import { API_PREFIX } from "@constants";
import { api } from "@configs";

export const createNewUser = async ({ ...payload }) => {
  const response = await api.post(`${API_PREFIX}/users/register`, {
    ...payload,
  });

  return {
    data: response.data,
    message: response.message,
  };
};
