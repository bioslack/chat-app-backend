import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { HttpError } from "../utils";

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
});

const signupSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});

const idPattern = /[a-f0-9]{24}/;

const createGroupSchema = Joi.object({
  name: Joi.string().min(5).required(),
  picture: Joi.string().empty(),
  admins: Joi.array()
    .min(1)
    .items(Joi.string().regex(RegExp(idPattern)).length(24)),
  members: Joi.array()
    .min(1)
    .items(Joi.string().regex(RegExp(idPattern)).length(24)),
});

const addUserToGroupSchema = Joi.object({
  groupId: Joi.string().regex(RegExp(idPattern)).length(24),
  userIds: Joi.array()
    .min(1)
    .items(Joi.string().regex(RegExp(idPattern)).length(24)),
});

const renameGroupSchema = Joi.object({
  groupId: Joi.string().regex(RegExp(idPattern)).length(24),
  name: Joi.string().min(5),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validator = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (Object.keys(schema.validate(req.body)).includes("error"))
      throw new HttpError(400, "Validation error");
    next();
  };
};

export const signinValidator = () => {
  return validator(signinSchema);
};

export const signupValidator = () => {
  return validator(signupSchema);
};

export const createGroupValidator = () => {
  return validator(createGroupSchema);
};

export const addUsersToGroupValidator = () => {
  return validator(addUserToGroupSchema);
};

export const renameGroupValidator = () => {
  return validator(renameGroupSchema);
};
