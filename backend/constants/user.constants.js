// User statuses
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

// Validation rules
export const USER_VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  AGE_MIN: 13,
  AGE_MAX: 150,
};

// Default values
export const USER_DEFAULTS = {
  IS_ACTIVE: false,
  LOGIN_COUNT: 0,
};

// User events
export const USER_EVENTS = {
  CREATED: "user.created",
  UPDATED: "user.updated",
  DELETED: "user.deleted",
  LOGIN: "user.login",
  LOGOUT: "user.logout",
  PASSWORD_CHANGED: "user.password.changed",
  ACTIVATED: "user.activated",
  REGISTERED: "user.registered",
  AUTHORIZED: "user.authorized",
};

// User success messages
export const USER_MESSAGES = {
  CREATED: "User was created successfully",
  UPDATED: "User was updated successfully",
  DELETED: "User was deleted successfully",
  ACTIVATED: "User was activated successfully",
  PASSWORD_CHANGED: "User password was changed successfully",
  REGISTERED: "User was registered successfully",
  AUTHORIZED: "User authorized successfully",
  LOGOUT: "User logout successfully"
};
