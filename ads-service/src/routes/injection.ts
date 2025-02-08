import AdsController, { IAdsController } from "../controllers/adsControllers";
import AdminController, {
  IAdminController,
} from "../controllers/adminController";
import PaymentController, {
  IPaymentController,
} from "../controllers/PayUControllers";

import AdminService, { IAdminService } from "../services/adminService";
import AdsService, { IAdsService } from "../services/adsService";
import PostService, { IPostService } from "../services/postsService";
import UserService, { IUserService } from "../services/userServices";

import AdsRepository, { IAdsRepository } from "../repositories/adsRepository";
import PayURepository, {
  IPayURepository,
} from "../repositories/PayURepository";
import AdminRepository, {
  IAdminRepository,
} from "../repositories/adminRepository";
import PostRepository, {
  IPostRepository,
} from "../repositories/postsRepository";
import UserRepository, {
  IUserRepository,
} from "../repositories/userRepository";

const adsRepository: IAdsRepository = new AdsRepository();
const payURepository: IPayURepository = new PayURepository();
const adminRepository: IAdminRepository = new AdminRepository();
const postRepository: IPostRepository = new PostRepository();
const userRepository: IUserRepository = new UserRepository();

const userService: IUserService = new UserService(userRepository);
const adminService: IAdminService = new AdminService(
  adminRepository,
  adsRepository
);
const adsService: IAdsService = new AdsService(
  payURepository,
  adsRepository,
  userService
);
const postService: IPostService = new PostService(postRepository);

const adminController: IAdminController = new AdminController(adminService);
const adsController: IAdsController = new AdsController(adsService);
const paymentController: IPaymentController = new PaymentController();

export {
  paymentController,
  adsController,
  adminController,
  userService,
  postService,
};
