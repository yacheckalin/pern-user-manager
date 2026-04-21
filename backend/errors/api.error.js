class ApiError extends Error {
  constructor({ message, code, status, details } = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.daetails = details
    this.message = message
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