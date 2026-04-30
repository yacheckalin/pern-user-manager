import Joi from "joi";
import { USER_VALIDATION } from "../constants/user.constants.js";
import { USER_ERRORS } from "../constants/error.constants.js";

const userSchemas = {
  createUser: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(USER_VALIDATION.USERNAME_MIN_LENGTH)
      .max(USER_VALIDATION.USERNAME_MAX_LENGTH)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(USER_VALIDATION.PASSWORD_MIN_LENGTH).required(),
    age: Joi.number()
      .integer()
      .min(USER_VALIDATION.AGE_MIN)
      .max(USER_VALIDATION.AGE_MAX),
    is_active: Joi.boolean(),

  }),
  id: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),

  updateUser: Joi.object({
    id: Joi.number().integer().required(),
    username: Joi.string().alphanum().max(USER_VALIDATION.USERNAME_MAX_LENGTH),
    email: Joi.string(),
    age: Joi.number().integer(),
  }),

  changePassword: Joi.object({
    id: Joi.number().integer().required(),
    old_password: Joi.string()
      .min(USER_VALIDATION.PASSWORD_MIN_LENGTH)
      .required()
      .messages({
        "string.min": "Password mus be at least 6 characters long",
      }),
    new_password: Joi.string()
      .min(USER_VALIDATION.PASSWORD_MIN_LENGTH)
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters long",
      }),
    confirm_password: Joi.any()
      .equal(Joi.ref("new_password"))
      .required()
      .messages({
        "any.only": "Password do not match",
      }),
  }).with("new_password", "confirm_password"),

  deleteUser: Joi.object({
    id: Joi.number().integer().required(),
  }),

  activateUser: Joi.object({
    id: Joi.number().integer().required(),
  }),
  registerUser: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(USER_VALIDATION.USERNAME_MIN_LENGTH)
      .max(USER_VALIDATION.USERNAME_MAX_LENGTH)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(USER_VALIDATION.PASSWORD_MIN_LENGTH)
      .max(USER_VALIDATION.PASSWORD_MAX_LENGTH)
      .required(),
    confirm_password: Joi.string()
      .min(USER_VALIDATION.PASSWORD_MIN_LENGTH)
      .max(USER_VALIDATION.PASSWORD_MAX_LENGTH)
      .required()
      .equal(Joi.ref("password"))
      .messages({ "any.only": USER_ERRORS.INVALID_CONFIRM_PASSWORD }),
    age: Joi.number().integer(),
  }).with("password", "confirm_password"),
  logoutUser: Joi.object({
    id: Joi.number().integer().required(),
  }),
  getUsers: Joi.object({
    s: Joi.string().allow('', null).max(50),
    isActive: Joi.boolean(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  })
};

export { userSchemas };
