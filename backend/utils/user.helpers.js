import validator from 'validator';

export const sanitizeUserData = (data) => ({
  ...data,
  email: data.email ? validator.normalizeEmail(String(data.email)) : data.email,
  username: typeof data.username == 'string' ? validator.trim(data.username) : data.username,
  is_active: typeof data.is_active == 'boolean' ? data.is_active : validator.toBoolean(String(data.is_active) || 'false'),
  password: typeof data.password == 'string' ? validator.trim(data.password) : data.password,
  confirm_password: typeof data.confirm_password == 'string' ? validator.trim(data.confirm_password) : data.confirm_password,
  age: typeof data.age == 'number' ? data.age : validator.toInt(String(data.age) || '0'),
  ip: data.ip ? validator.trim(String(data.ip)) : data.ip,
  userAgent: data.userAgent ? validator.trim(String(data.userAgent)) : data.userAgent,
  refreshToken: data.refreshToken ? validator.trim(String(data.refreshToken)) : data.refreshToken
});


export const sanitizeUpdateUserPassword = (data) => ({
  ...data,
  old_password: typeof data.old_password == 'string' ? validator.trim(data.old_password) : data.old_password,
  new_password: typeof data.new_password == 'string' ? validator.trim(data.new_password) : data.new_password,
  confirm_password: typeof data.confirm_password == 'string' ? validator.trim(data.confirm_password) : data.confirm_password
})