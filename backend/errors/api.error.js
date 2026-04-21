import { HTTP_INTERNAL_SERVER_ERROR, SERVER_ERROR } from "../constants/index.js";

class ApiError extends Error {
  constructor({ message, code, status, details } = {}) {
    super(message || SERVER_ERROR.INTERNAL_SERVER_ERROR);
    this.code = code;
    this.status = Number(status) || HTTP_INTERNAL_SERVER_ERROR;
    this.details = details;
    this.message = message || SERVER_ERROR.INTERNAL_SERVER_ERROR;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      status: this.status,
      detials: this.detials
    }
  }
}

export default ApiError