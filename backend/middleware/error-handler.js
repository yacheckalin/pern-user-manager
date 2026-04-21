import { HTTP_INTERNAL_SERVER_ERROR, SERVER_ERROR } from "../constants/index.js";
import ApiError from "../errors/api.error.js";
import logger from '../logger.js';
import "dotenv/config";

const errorHandler = (err, req, res, next) => {

  const traceEnvironment = process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === "debug";

  const error = err instanceof Error && 'toJSON' in err ? err : new ApiError({
    code: HTTP_INTERNAL_SERVER_ERROR,
    message: SERVER_ERROR.INTERNAL_SERVER_ERROR || String(err),
    status: HTTP_INTERNAL_SERVER_ERROR,
    details: traceEnvironment ? err.stack : null
  })

  logger.error(
    `[Error] ${err.message}`,
    { err: error, path: req.path, method: req.method, requestId: req.headers['x-request-id'] },
  )

  const statusCode = err.statusCode || HTTP_INTERNAL_SERVER_ERROR;
  const message = err.toJSON ? { ...err.toJSON() } : err.message || SERVER_ERROR.INTERNAL_SERVER_ERROR
  res.status(statusCode).json({
    success: false,
    ...message,
    stack: traceEnvironment ? err.stack : undefined,
  });
};

export default errorHandler;
