import Joi from "joi";
import { emailRegexp } from "../constans/user-constans.js";

export const userSignUpSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string(),
});
export const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
export const userUpdateSubscribe = Joi.object({
  subscription: Joi.string().required(),
});
//  enum: ["starter", "pro", "business"],
