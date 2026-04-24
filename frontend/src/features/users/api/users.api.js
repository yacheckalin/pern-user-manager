import axios from 'axios';
import { API_PREFIX } from '@constants';

export const getUsers = async ({ page = 1, limit = 10, search = '', role = '' }) => {
  const response = await axios.get(`${API_PREFIX}/users`, {
    params: { _page: page, _limit: limit, q: search, role }
  });
  return {
    data: response.data,
    total: parseInt(response.headers['x-total-count'] || 0)
  };
};