import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
import { Types } from "mongoose";
import { IWenetickRequest } from "../models/WenetTickRequest";

export interface IAdmin {
  _id?: string;
  username: string;
  password: string;
}

export interface IGoogleCredentialRes {
  credential: string;
  clientId: string;
  select_by: string;
}

export interface IMulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export interface IUserController {
  signupController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  sendOTPController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  reSendOTPController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  verifyOTPController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  loginController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  googleSigninController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  changeAccountType(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  requestWenetTick(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  hasRequestedTick(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  hasWenetTick(req: Request, res: Response, next: NextFunction): Promise<void>;
  restrictUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  blockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserService {
  addUser(userData: IUser): Promise<IUser>;
  findUser(userData: IUser): Promise<IUser>;
  addUserData(userData: IUser): Promise<IUser>;
  sendOTP(email: string): Promise<string>;
  reSendOTP(userData: IUser): Promise<string>;
  verifyOTP(_id: string, otp: string): Promise<string>;
  verifyLogin(username: string, password: string): Promise<IUser>;
  generateJWT(userData: IUser): Promise<string>;
  generateRefreshJWT(userData: IUser): Promise<string>;
  googleSignin(
    credentialResponse: IGoogleCredentialRes
  ): Promise<{ user: IUser; exisitngUser: boolean }>;
  sendUserDataToMQ(_id: string, action: string): Promise<void>;
  sendUserDataToAdsMQ(_id: string, action: string): Promise<void>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<string>;
  forgotPassword(email: string): Promise<string>;
  changeAccountType(userId: string, accountType: string): Promise<IUser>;
  requestWenetTick(
    userId: string,
    imageUrl: string,
    description: string
  ): Promise<any>; // Replace `any` with the actual type if known
  hasRequestedTick(
    userId: string
  ): Promise<{ hasRequestedTick: boolean; status: any }>; // Replace `any` with the status type if known
  hasWenetTick(username: string): Promise<boolean>;
  restrictUser(userId: string): Promise<IUser>;
  blockUser(username: string): Promise<IUser>;
}

export interface IUserRepository {
  addUser(userData: IUser): Promise<IUser>;
  addUserData(userData: IUser): Promise<IUser>;
  sendOTP(email: string): Promise<string>;
  verifyOTP(_id: string, otp: string): Promise<string>;
  verifyLogin(username: string, password: string): Promise<IUser>;
  findUser(userData: IUser): Promise<IUser>;
  generateJWT(userData: IUser): Promise<string>;
  generateRefreshJWT(userData: IUser): Promise<string>;
  googleSignin(
    credentialResponse: IGoogleCredentialRes
  ): Promise<{ user: IUser; exisitngUser: boolean }>;
  sendUserDataToMQ(_id: string, action: string): Promise<void>;
  sendUserDataToAdsMQ(_id: string, action: string): Promise<void>;
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<string>;
  forgotPassword(email: string): Promise<string>;
  changeAccountType(
    userId: string,
    accountType: "personalAccount" | "celebrity" | "company"
  ): Promise<IUser>;
  requestWenetTick(
    userId: string,
    imageUrl: string,
    description: string
  ): Promise<any>;
  getTickRequestData(userId: string): Promise<any>;
  sendRestrictNotificationToMQ(
    userId: string | Types.ObjectId,
    doneByUser: string | Types.ObjectId,
    type: "restrict" | "approved" | "rejected",
    notificationMessage: string,
    entityType: "users",
    entityId: string | Types.ObjectId
  ): Promise<void>;
  getUserData(username: string): Promise<IUser | null>;
  restrictUser(userId: string): Promise<IUser>;
  blockUser(username: string): Promise<IUser>;
}

export interface IProfileService {
  getUserData(_id: string | Types.ObjectId): Promise<IUser>;
  editUserData(_id: string | Types.ObjectId, userData: IUser): Promise<IUser>;
  generateJWT(userData: IUser): Promise<string>;
  uploadImage(imageFile: unknown, imageType: string): Promise<string>;
  getProfileData(username: string): Promise<IUser>;
  toggleFollow(currentUserId: string, userToFollow: string): Promise<boolean>;
  toggleRemove(currentUserId: string, userToRemove: string): Promise<boolean>;
  isFollowing(currentUserId: string, userToFollow: string): Promise<boolean>;
  searchUsers(keyword: string): Promise<IUser[]>;
  toggleBlock(currUser: string, userId: string): Promise<boolean>;
  isBlocked(currentUserId: string, otherUser: string): Promise<boolean>;
  getBlockedUsers(
    pageNo: number,
    rowsPerPage: number,
    userId: string
  ): Promise<any>;
  getFollowingUsers(currentUserId: string): Promise<any>;
}

export interface IProfileRepository {
  getUserData(_id: string | Types.ObjectId): Promise<IUser>;
  editUserData(_id: string | Types.ObjectId, userData: IUser): Promise<IUser>;
  generateJWT(userData: IUser): Promise<string>;
  uploadImage(imageFile: unknown, imageType: string): Promise<string>;
  getProfileData(username: string): Promise<IUser>;
  isFollowing(user1: string, user2: string): Promise<boolean>;
  toggleFollow(user1: string, user2: string): Promise<boolean>;
  toggleRemove(currentUserId: string, userToRemove: string): Promise<boolean>;
  searchUsers(keyword: string): Promise<IUser[]>;
  sendNotificationToMQ(
    userId: string | Types.ObjectId,
    doneByUser: string | Types.ObjectId,
    type: "follow" | "like" | "comment",
    notificationMessage: string,
    entityType: "posts" | "users",
    entityId: string | Types.ObjectId
  ): Promise<void>;
  toggleBlock(user1: string, user2: string): Promise<boolean>;
  isBlocked(user1: string, user2: string): Promise<boolean>;
  getBlockedUsers(userId: string): Promise<Types.ObjectId[] | undefined>;
  getFollowingUsers(userId: string): Promise<Types.ObjectId[] | undefined>;
}

export interface IProfileController {
  getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserData(req: Request, res: Response, next: NextFunction): Promise<void>;
  editUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  updatePic(req: Request, res: Response, next: NextFunction): Promise<void>;
  getProfileData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  toggleFollow(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleRemove(req: Request, res: Response, next: NextFunction): Promise<void>;
  isFollowing(req: Request, res: Response, next: NextFunction): Promise<void>;
  searchUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  toggleBlockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  isBlocked(req: Request, res: Response, next: NextFunction): Promise<void>;
  getBlockedUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getFollowingUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  uploadWeNetTickRequestPic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export interface IAdminController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;

  userManagement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  dashboardCardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  dashboardChartData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  dashboardChartDataAccountType(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getTickRequestsData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  changeTickRequestStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export interface IAdminService {
  verifyLogin(username: string, password: string): Promise<string>;

  generateJWT(adminUsername: string): Promise<string>;

  dashboardCardData(): Promise<number[]>;

  dashboardChartData(): Promise<[string, string][]>;

  dashboardChartDataAccountType(): Promise<[string, number][]>;

  getTickRequestsData(
    pageNo: number,
    rowsPerPage: number
  ): Promise<[any[], number]>;

  changeTickRequestStatus(
    requestId: string,
    status: "approved" | "rejected",
    userId: string
  ): Promise<any>;
}

export interface IAdminRepository {
  verifyLogin(username: string, password: string): Promise<string>;

  generateJWT(adminUsername: string): Promise<string>;

  dashboardCardData(): Promise<number[]>;

  dashboardChartData(
    startDate: Date
  ): Promise<{ _id: string; count: number }[]>;

  personalAccountCount(): Promise<number>;

  celebrityAccountCount(): Promise<number>;

  companyAccountCount(): Promise<number>;

  getTickRequestsData(skip: number, limit: number): Promise<IWenetickRequest[]>;

  getTickRequestDocumentCount(): Promise<number>;

  changeTickRequestStatus(
    requestId: string,
    status: "approved" | "rejected"
  ): Promise<IWenetickRequest>;

  giveTickToUser(userId: string): Promise<IUser>;
}
