import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../utils/enum";
import { MESSAGES } from "../utils/constants";

export function verifyUser(req: any, res: Response, next: NextFunction) {
  const userToken = req.cookies?.token;

  if (!userToken) {
    res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.ERROR.JWT_NOT_FOUND);
    return;
  }

  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(MESSAGES.ERROR.JWT_SECRET_NOT_FOUND);
    return;
  }

  try {
    const decoded: any = jwt.verify(userToken, secret);
    req.user = decoded?.userData;

    if (!decoded?.role || decoded.role != "wenet-user") {
      res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.ERROR.INVALID_JWT);
      return;
    }

    next();
  } catch (err: any) {
    res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.ERROR.INVALID_JWT);
    return;
  }
}
