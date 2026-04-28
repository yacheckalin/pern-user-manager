import { API_PREFIX } from "@constants";
import { api } from "@configs";

export const deleteUserById = async ({ id = null }) => {
  const response = await api.delete(`${API_PREFIX}/users/${id}`);
  return { data: response.data, message: response.message };
};
