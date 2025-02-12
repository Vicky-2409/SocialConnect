import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { EnvErrorMsg, JwtErrorMsg, Role } from "../utils/constants";
import { IUser } from "../models/User";
import userCollection from "../models/User";

interface UserData {
  id: string;
  username: string;
  role: string;
}

interface CustomRequest extends Request {
  user?: UserData;
}

export async function verifyUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userToken = req.cookies?.token;
  const refreshToken = req.cookies?.refreshToken;

  if (!userToken && !refreshToken) {
    res.status(401).send(JwtErrorMsg.JWT_NOT_FOUND);
    return;
  }

  const secret = process.env.JWT_SECRET || "";
  if (!secret) {
    res.status(500).json(EnvErrorMsg.JWT_NOT_FOUND);
    return;
  }

  try {
    const decoded = jwt.verify(userToken, secret) as {
      userData: UserData;
      role: string;
    };
    req.user = decoded.userData;

    if (!decoded?.role || decoded.role !== Role.User) {
      res.status(401).send(JwtErrorMsg.INVALID_JWT);
      return;
    }

    const user: IUser | null = await userCollection.findOne({
      username: decoded.userData?.username,
    });

    if (!user || user.isRestricted) {
      const message = !user
        ? "User not found"
        : "User is restricted and cannot perform this action";
      res.status(401).json({ message });
      return;
    }

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, secret) as {
          userData: UserData;
          role: string;
        };
        const user: IUser | null = await userCollection.findOne({
          username: decodedRefresh.userData?.username,
        });

        if (!user || user.isRestricted) {
          const message = !user
            ? "User not found"
            : "User is restricted and cannot perform this action";
          res.status(401).json({ message });
          return;
        }

        const newAccessToken = await jwt.sign(
          { userData: decodedRefresh.userData, role: decodedRefresh.role },
          secret,
          { expiresIn: "15m" }
        );

        res.cookie("token", newAccessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
        });

        req.user = decodedRefresh.userData;
        next();
      } catch (refreshError) {
        res.status(401).send(JwtErrorMsg.INVALID_JWT);
      }
    } else {
      res.status(401).send(JwtErrorMsg.INVALID_JWT);
    }
  }
}
