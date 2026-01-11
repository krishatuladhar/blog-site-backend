import Joi from "joi";

export const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(1).required(),
  category: Joi.string().max(100).required(),
  author_id: Joi.number().required(),
  isFeatured: Joi.boolean().optional(),
});

export const updateBlogSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).optional(),
  category: Joi.string().max(100).optional(),
  isFeatured: Joi.boolean().optional(),
});
