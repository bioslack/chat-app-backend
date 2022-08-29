import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils";

const checkRequestBody = (fields: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const mapped = fields.map((f) => Object.keys(req.body).includes(f));
    if (mapped.includes(false)) throw new HttpError(400);
    next();
  };
};

export default checkRequestBody;
