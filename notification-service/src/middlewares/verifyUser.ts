import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../utils/StatusCode";
import { MESSAGES } from "../utils/constants";

interface UserData {
  id: string;
  name: string;
  role: string;
}

interface CustomRequest extends Request {
  user?: UserData;
}

export function verifyUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void {
  const userToken = req.cookies?.token;

  if (!userToken) {
    res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.JWT_NOT_FOUND);
    return; // Ensure no further execution.
  }

  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json(MESSAGES.JWT_SECRET_NOT_FOUND);

    return; // Ensure no further execution.
  }

  try {
    const decoded = jwt.verify(userToken, secret) as {
      userData: UserData;
      role: string;
    };
    req.user = decoded.userData;

    if (!decoded?.role || decoded.role !== "wenet-user") {
      res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.INVALID_JWT);
      return; // Ensure no further execution.
    }

    next(); // Pass control to the next middleware.
  } catch (err) {
    res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.INVALID_JWT);
  }
}
