import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
import { ResponseMsg, UserErrorMsg } from "../utils/constants";
import { IUserController, IUserService, IProfileService } from "../types/types";
import logger from "../utils/logger";

export default class UserController implements IUserController {
  private userService: IUserService;
  private profileService: IProfileService;
  constructor(userService: IUserService, profileService: IProfileService) {
    this.userService = userService;
    this.profileService = profileService;
    logger.info('UserController initialized');
  }
  async signupController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: IUser = req.body;
      logger.debug(`Starting user signup process`, { username: userData.username });
      const user = await this.userService.addUser(userData);
      logger.info(`User signup successful`, { userId: user._id });
      res.status(201).json(user);
    } catch (error:any) {
      logger.error(`Signup failed`, { error: error?.message, stack: error?.stack });
      next(error);
    }
  }

  async sendOTPController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: IUser = req.body;
      logger.debug(`Sending OTP`, { username: userData.username });
      await this.userService.addUserData(userData);
      logger.info(`OTP sent successfully`, { username: userData.username });
      res.status(200).send(ResponseMsg.OTP_SUCCESS);
    } catch (error:any) {
      logger.error(`Failed to send OTP`, { error: error?.message });
      next(error);
    }
  }

  async reSendOTPController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData: IUser = req.body;
      logger.debug(`Resending OTP`, { username: userData.username });

      await this.userService.reSendOTP(userData);
      logger.info(`OTP resent successfully`, { username: userData.username });

      res.status(200).send(ResponseMsg.OTP_SUCCESS);
    } catch (error:any) {
      logger.error(`Failed to resend OTP`, { error: error?.message });

      next(error);
    }
  }

  async verifyOTPController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const otpData: { _id: string; otp: string } = req.body;
      logger.debug(`Verifying OTP`, { otpData});
      const { _id, otp } = otpData;
      await this.userService.verifyOTP(_id, otp);
      logger.info(`OTP verified successfully`, { userId: _id });

      res.status(200).send(ResponseMsg.OTP_VERIFIED);
    } catch (error:any) {
      logger.error(`OTP verification failed`, { error: error?.message });

      next(error);
    }
  }

  async loginController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const loginData: { username: string; password: string } = req.body;
      logger.debug(`Login attempt`, { loginData});

      const userData: IUser = await this.userService.verifyLogin(
        loginData.username,
        loginData.password
      );

      if (!userData) next(new Error(UserErrorMsg.NO_USER_DATA));

      const token = await this.userService.generateJWT(userData);
      const refreshToken = await this.userService.generateRefreshJWT(userData);
      logger.info(`User logged in successfully`, { userId: userData._id });

      res.cookie("token", token);
      res.cookie("refreshToken", refreshToken);
      res.status(200).json({ userData, message: ResponseMsg.USER_LOGGED_IN });
    } catch (error:any) {
      logger.error(`Login failed`, { error: error?.message });

      next(error);
    }
  }

  async googleSigninController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.debug(`Google signin attempt`, { email: req.body.email });

      const { user, exisitngUser }: any = await this.userService.googleSignin(
        req.body
      );

      const token = await this.userService.generateJWT(user);
      logger.info(`Google signin successful`, { userId: user._id });


      res.cookie("token", token);
      res
        .status(200)
        .json({ userData: user, message: ResponseMsg.USER_LOGGED_IN });
    } catch (error:any) {
      logger.error(`Google signin failed`, { error: error?.message, stack: error?.stack });

      console.error(error);
      next(error);
    }
  }

  async changePassword(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      logger.debug(`Password change request`, { userId });

      const { newPassword, currentPassword } = req.body;

      const message = await this.userService.changePassword(
        userId,
        currentPassword,
        newPassword
      );
      logger.info(`Password changed successfully`, { userId });

      res.status(200).send(message);
    } catch (error:any) {
      console.error(error);
      logger.error(`Password change failed`, { userId: req.user._id, error: error?.message });

      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      logger.debug(`Forgot password request`, { email });

      const message = await this.userService.forgotPassword(email);
      logger.info(`Forgot password email sent`, { email });

      res.status(200).send(message);
    } catch (error:any) {
      console.error(error);
      logger.error(`Forgot password process failed`, { email: req.body.email, error: error?.message });

      next(error);
    }
  }

  async changeAccountType(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const { accountType } = req.body;
      logger.debug(`Account type change request`, { userId, accountType });

      const userData = await this.userService.changeAccountType(
        userId,
        accountType
      );
      if (!userData) throw new Error(UserErrorMsg.NO_USER_DATA);

      const token = await this.profileService.generateJWT(userData);
      logger.info(`Account type changed successfully`, { userId, newType: accountType });

      res.cookie("token", token);

      res.status(200).send(ResponseMsg.ACCOUNT_TYPE_UPDATED);
    } catch (error:any) {
      console.error(error);
      logger.error(`Account type change failed`, { userId: req.user._id, error: error?.message });

      next(error);
    }
  }

  async requestWenetTick(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { imageUrl, description } = req.body;
      const userId = req.user._id;
      logger.debug(`Wenet tick request`, { userId });


      const wenetRequestData = await this.userService.requestWenetTick(
        userId,
        imageUrl,
        description
      );
      logger.info(`Wenet tick request submitted`, { userId });

      res.status(200).send(wenetRequestData);
    } catch (error:any) {
      console.error(error);
      logger.error(`Wenet tick request failed`, { userId: req.user._id, error: error?.message });

      next(error);
    }
  }

  async hasRequestedTick(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user._id;
      logger.debug(`Checking tick request status${ userId }`);

      const data = await this.userService.hasRequestedTick(userId);
      logger.info(`Tick request status retrieved ${data}`);

      res.status(200).send(data);
    } catch (error:any) {
      console.error(error);
      logger.error(`Failed to check tick request status`, { userId: req.user._id, error: error?.message });

      next(error);
    }
  }

  async hasWenetTick(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username } = req.params;
      logger.debug(`Checking Wenet tick status`, { username });

      const data = await this.userService.hasWenetTick(username);
      logger.info(`Wenet tick status retrieved`, { username, hasTick: !!data });

      res.status(200).send(data);
    } catch (error:any) {
      console.error(error);
      logger.error(`Failed to check Wenet tick status`, { username: req.params.username, error: error?.message });

      next(error);
    }
  }

  async restrictUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;
      logger.debug(`User restriction request`, { targetUserId: userId });



      if (!userId) {
        logger.warn(`User restriction failed - no userId provided`);

        throw new Error(UserErrorMsg.NO_USER_ID);
      }

      const userData = await this.userService.restrictUser(userId);
      logger.info(`User restricted successfully`, { targetUserId: userId });


      res.status(200).json({ message: userData });
    } catch (error: any) {
      logger.error(`User restriction failed`, { targetUserId: req.params.userId, error: error?.message });

      next(error);
    }
  }

  async blockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const username = req.body.username;
      logger.debug(`User block request`, { targetUsername: username });

      if (!username) {
        logger.warn(`User block failed - no username provided`);

        throw new Error(UserErrorMsg.NO_USERNAME);
      }
      const userData = await this.userService.blockUser(username);
      logger.info(`User blocked successfully`, { targetUsername: username });

      res.status(200).json({ message: userData, success: true });
    } catch (error: any) {
      logger.error(`User block failed`, { targetUsername: req.body.username, error: error?.message });

      next(error);
    }
  }
}
