import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../utils/enums";
import { MESSAGES, Role } from "../utils/constants";

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const adminToken = req.cookies?.adminToken;

  if (!adminToken) {
    res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.ADMIN_JWT_NOT_FOUND);
    return;
  }

  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send(MESSAGES.JWT_SECRET_NOT_FOUND);
    return;
  }

  try {
    const decoded: any = jwt.verify(adminToken, secret);
    if (!decoded?.role || decoded.role != Role.Admin) {
      res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.INVALID_ADMIN_JWT);
      return;
    }

    next();
  } catch (err: any) {
    res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.INVALID_ADMIN_JWT);
    return;
  }
}
