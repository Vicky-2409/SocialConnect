import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/userCollection";
import UserSchema from "../models/userCollection";
import { StatusCode } from "../utils/enums";
import { MESSAGES, Role } from "../utils/constants";

interface UserData {
  id: string;
  username: string;
  isRestricted: boolean;
}

export async function verifyUser(req: any, res: Response, next: NextFunction) {
  const userToken = req.cookies?.token;

  if (!userToken) {
    res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.JWT_NOT_FOUND);
    return;
  }

  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .send(MESSAGES.JWT_SECRET_NOT_FOUND);
    return;
    return;
  }

  try {
    const decoded: any = jwt.verify(userToken, secret);
    req.user = decoded?.userData;

    if (!decoded?.role || decoded.role != Role.User) {
      res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.INVALID_JWT);
      return;
    }

    const user: UserData | null = await UserSchema.findOne({
      username: decoded.userData?.username,
    });

    if (!user || user.isRestricted) {
      const message = !user
        ? "User not found"
        : "User is restricted and cannot perform this action";
      res.status(StatusCode.UNAUTHORIZED).json({ message });
      return; // Stop further execution.
    }

    next();
  } catch (err: any) {
    res.status(StatusCode.UNAUTHORIZED).send(MESSAGES.INVALID_JWT);
    return;
  }
}
