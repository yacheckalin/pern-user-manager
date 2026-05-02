import { API_PREFIX } from '@constants';
import { api } from '@configs';

export const getUserStats = async () => {
  const response = await api.get(`${API_PREFIX}/users/stats`);

  return { data: response.data, message: response.message }
}