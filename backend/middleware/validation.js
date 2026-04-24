import { HTTP_BAD_REQUEST } from "../constants/http.constants.js";
import ApiError from "../errors/api.error.js";

function validate(schema) {
  return (req, res, next) => {
    const data = { ...req.params, ...req.body, ...req.query };
    const { error, value } = schema.validate(data);

    if (error) {

      const errObj = new ApiError({
        message: error.details[0].message,
        status: HTTP_BAD_REQUEST,
        details: process.env.NODE_ENV === "development" || process.env.LOG_LEVEL === "debug" ? error.stack : undefined,
        code: ""
      });

      next(errObj)
    }

    // attach validated data to request
    req.validatedData = value;
    next();
  };
}

export { validate };
