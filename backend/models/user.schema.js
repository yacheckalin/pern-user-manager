import Joi from "joi";

const userSchemas = {
  createUser: Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    age: Joi.number().integer().min(13).max(150),
    is_active: Joi.boolean(),
  }),
  id: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
};

export { userSchemas };
