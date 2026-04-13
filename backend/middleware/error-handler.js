export { HTTP_INTERNAL_SERVER_ERROR } from "../constants/http.constants.js";

const errorHandler = (err, req, res, next) => {
  if (process.env.LOG_LEVEL === "error" || process.env.NODE_ENV === "development") {
    console.error(`[Error] ${err.message}`);
  }
  const statusCode = err.statusCode || HTTP_INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" || process.env.LOG_LEVEL === "debug" ? err.stack : undefined,
  });
};

export default errorHandler;
