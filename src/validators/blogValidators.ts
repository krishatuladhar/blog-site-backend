import Joi from "joi";

export const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(200).required(),
  author_id: Joi.number().required(),
});

export const updateBlogSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).max(200).optional(),
});
