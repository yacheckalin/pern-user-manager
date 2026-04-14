import Joi from 'joi';
import { USER_VALIDATION } from '../constants';

const authSchema = {
  login: Joi.object({
    username: Joi.alternatives().try(
      Joi.string()
        .alphanum()
        .min(USER_VALIDATION.USERNAME_MIN_LENGTH)
        .max(USER_VALIDATION.USERNAME_MAX_LENGTH),
      Joi.string().email()
    ).required(),
    password: Joi.string()
      .min(USER_VALIDATION.PASSWORD_MIN_LENGTH)
      .max(USER_VALIDATION.PASSWORD_MAX_LENGTH)
      .required()
  }),
}

export { authSchema };