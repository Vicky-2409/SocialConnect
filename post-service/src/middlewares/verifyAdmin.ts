import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { MESSAGES } from "../utils/constants";
import { StatusCode } from "../utils/StatusCode";

export function verifyAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
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
    if (!decoded?.role || decoded.role !== "wenet-admin") {
      res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.INVALID_ADMIN_JWT);
      return;
    }

    next(); // Proceed to the next middleware
  } catch (err: any) {
    res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.INVALID_ADMIN_JWT);
  }
}
