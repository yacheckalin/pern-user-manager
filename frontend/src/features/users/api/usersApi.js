import axios from 'axios';

export const getUsers = async ({ page = 1, limit = 10, search = '', role = '' }) => {
  const response = await axios.get('/api/v1/users', {
    params: { _page: page, _limit: limit, q: search, role }
  });
  return {
    data: response.data,
    total: parseInt(response.headers['x-total-count'] || 0)
  };
};