// Success
export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_ACCEPTED = 202;
export const HTTP_NO_CONTENT = 204;

// Client Errors
export const HTTP_BAD_REQUEST = 400;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_FORBIDDEN = 403;
export const HTTP_NOT_FOUND = 404;
export const HTTP_CONFLICT = 409;

// Server Errors
export const HTTP_INTERNAL_SERVER_ERROR = 500;
export const HTTP_BAD_GATEWAY = 502;
export const HTTP_SERVICE_UNAVAILABLE = 503;

// HTTP Methods
export const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// Headers
export const HEADERS = {
  CONTENT_TYPE: "Content-Type",
  ACCEPT: "Accept",
  CACHE_CONTROL: "Cache-Control",
};
