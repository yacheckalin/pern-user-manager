export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const onlineUsers = (data) => data.filter((item) => item.hasActiveSession).length
export const activeUsers = (data) => data.filter((item) => item.isActive).length
export const notActive = (data) => data.filter((item) => !item.isActive).length

export const delay = (delay) => new Promise((resolve) => setTimeout(resolve, delay))