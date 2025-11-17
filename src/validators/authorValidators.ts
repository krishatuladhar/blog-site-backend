import Joi from "joi";

export const createAuthorSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
});

export const updateAuthorSchema = Joi.object({
  name: Joi.string().min(2).max(120).optional(),
});
