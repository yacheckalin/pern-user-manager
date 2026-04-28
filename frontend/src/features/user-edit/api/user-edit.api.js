import { API_PREFIX } from "@constants";
import { api } from "@configs";

export const updateUserById = async ({ id, ...payload }) => {
  const response = await api.put(`${API_PREFIX}/users/${id}`, {
    ...payload,
    age: payload.age ? Number(payload.age) : undefined,
  });

  return {
    data: response.data,
    message: response.message,
  };
};
