import { API_PREFIX } from '@constants';
import { api } from '@configs';

export const getUserStatsByUserId = async ({ id }) => {
  const response = await api.getStats(`${API_PREFIX}/users/${id}/stats`);
  return { data: response.data, message: response.message }
}