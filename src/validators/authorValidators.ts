import Joi from "joi";

export const createAuthorSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "author").optional(),
});

export const updateAuthorSchema = Joi.object({
  name: Joi.string().min(2).max(120).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "author").optional(),
});
