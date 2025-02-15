import joi from "joi";

export const createMessageValidation = joi.object({
  message: joi.string().required().min(3).max(200),
  reciverId: joi.required(),
});
