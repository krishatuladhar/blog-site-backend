import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "author").optional(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(120).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "author").optional(),
});
