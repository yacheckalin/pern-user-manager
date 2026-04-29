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

export const logoutSessionByTokenId = async ({ id, ...payload }) => {
  const response = await api.delete(`${API_PREFIX}/tokens/${id}`, {
    ...payload,
  });

  return {
    data: response.data,
    message: response.message,
  };
};

export const getAllTokensByUserId = async ({ id, ...payload }) => {
  const response = await api.get(`${API_PREFIX}/users/${id}/tokens`, {
    ...payload
  });
  return {
    data: response.data,
    message: response.message
  }
}

