

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/userService";
import { IUser } from "../models/userCollection";
import userCollection from "../models/userCollection";
import { StatusCode } from "../utils/StatusCode";
import { MESSAGES } from "../utils/constants";

interface UserData {
  id: string;

  username: string;

}

interface CustomRequest extends Request {
  user?: UserData;
}

export async function verifyUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userToken = req.cookies?.token;
    
    if (!userToken) {
      res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.JWT_NOT_FOUND });
      return; // Stop further execution.
    }

    const secret = process.env.JWT_SECRET || "";
    if (!secret) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.JWT_SECRET_NOT_FOUND });
      return; // Stop further execution.
    }

    const decoded = jwt.verify(userToken, secret) as { userData: UserData; role: string };


    req.user = decoded.userData;


    


    if (!decoded?.role || decoded.role !== "wenet-user") {
      res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.INVALID_JWT_ROLE });
      return; // Stop further execution.
    }

    // Check if the user exists and is not restricted

    const user: IUser | null = await userCollection.findOne({ username: decoded.userData?.username });

    if (!user || user.isRestricted) {
      const message = !user
        ? MESSAGES.USER_NOT_FOUND
        : MESSAGES.USER_RESTRICTED;
        res.status(StatusCode.UNAUTHORIZED).json({ message });
      return; // Stop further execution.
    }



    next(); // Pass control to the next middleware.
  } catch (err: any) {
    console.error("Error during user verification:", err.message);
    res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.INVALID_JWT });
    return; // Stop further execution.
  }
}







