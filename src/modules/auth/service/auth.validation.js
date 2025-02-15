import joi from "joi";

export const signUpValidationSchema = joi.object({
  userName: joi.string().min(2).max(10).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 2 characters",
    "string.max": "Username must be at most 10 characters",
  }),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: ["com", "net"] })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp(/^[A-Z][a-z0-9]{3,8}$/))
    .required(),
  confirmedPassword: joi.string().valid(joi.ref("password")).required(),
  phone: joi
    .string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
});

export const signInValidationSchema = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: ["com", "net"] })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp(/^[A-Z][a-z0-9]{3,8}$/))
    .required(),
});
