import Joi from "joi";

const userSchemas = {
  createUser: Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password_hash: Joi.string().min(6).required(),
    age: Joi.number().ingeger().min(13).max(150),
    isActive: Joi.boolean(),
  }),
  id: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
};

function validate(schema) {
  return (req, res, next) => {
    const data = { ...req.params, ...req.body, ...req.query };
    const { error, value } = schema.validate(data);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    // attach validated data to request
    req.validatedData = value;
    next();
  };
}

export { validate, userSchemas };
