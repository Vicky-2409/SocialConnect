import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../utils/constants";
import { StatusCode } from "../utils/StatusCode";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorMsg = error.message || MESSAGES.UNEXPECTED_ERROR;
  console.log(errorMsg);
  res.status(StatusCode.BAD_REQUEST).send(errorMsg);
};
