import UserController from "../controllers/userController";
import UserService from "../services/userService";
import UserRepository from "../repositories/userRepository";
import ProfileService from "../services/profileService";
import ProfileRepository from "../repositories/profileRepository";
import ProfileController from "../controllers/profileController";
import AdminRepository from "../repositories/adminRepository";
import AdminService from "../services/adminService";
import AdminController from "../controllers/adminController";
import {
  IProfileController,
  IProfileRepository,
  IProfileService,
  IUserController,
  IUserRepository,
  IUserService,
  IAdminRepository,
  IAdminService,
  IAdminController,
} from "../types/types";

const userRepository: IUserRepository = new UserRepository();
const profileRepository: IProfileRepository = new ProfileRepository();
const adminRepository: IAdminRepository = new AdminRepository();

const userService: IUserService = new UserService(userRepository);
const profileService: IProfileService = new ProfileService(profileRepository);
const adminService: IAdminService = new AdminService(adminRepository,userRepository);

const userController: IUserController = new UserController(
  userService,
  profileService
);
const profileController: IProfileController = new ProfileController(
  userService,
  profileService
);
const adminController: IAdminController = new AdminController(adminService);

export { userController, profileController, adminController };
