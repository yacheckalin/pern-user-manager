import { HTTP_BAD_REQUEST } from "../constants/http.constants.js";

function validate(schema) {
  return (req, res, next) => {
    const data = { ...req.params, ...req.body, ...req.query };
    const { error, value } = schema.validate(data);

    if (error) {
      return res.status(HTTP_BAD_REQUEST).json({
        success: false,
        error: error.details[0].message,
      });
    }

    // attach validated data to request
    req.validatedData = value;
    next();
  };
}

export { validate };
