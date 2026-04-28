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

export const changeUserPassword = async ({ id, ...payload }) => {
  const response = await api.patch(`${API_PREFIX}/users/${id}/password`, {
    ...payload,
  });
  return {
    data: response.data,
    message: response.message,
  };
};

export const createNewUser = async ({ ...payload }) => {
  const response = await api.post(`${API_PREFIX}/users/register`, {
    ...payload,
  });

  return {
    data: response.data,
    message: response.message,
  };
};

export const logoutUserById = async ({ id, ...payload }) => {
  const response = await api.post(`${API_PREFIX}/users/${id}/logout`, {
    ...payload,
  });
  return {
    data: response.data,
    message: response.message,
  };
};
