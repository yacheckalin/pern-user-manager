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

  updateUser: Joi.object({
    id: Joi.number().integer().required(),
    username: Joi.string().alphanum().min(3).max(50),
    email: Joi.string().email(),
    age: Joi.number().integer().min(13).max(150),
  }),

  chagePassword: Joi.object({
    id: Joi.number().integer().required(),
    password: Joi.string().min(6).messages({
      "string.min": "Password must be at least 6 characters long",
    }),
    confirm_password: Joi.any().equal(Joi.ref("password")).messages({
      "any.only": "Password do not match",
    }),
  }).with("password", "confirm_password"),
};

export { userSchemas };
