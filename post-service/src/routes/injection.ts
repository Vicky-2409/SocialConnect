import AdminController, {
  IAdminController,
} from "../controllers/adminController";
import CommentController, {
  ICommentController,
} from "../controllers/commentsController";
import PostController, { IPostController } from "../controllers/postController";
import ReportsController, {
  IReportsController,
} from "../controllers/reportsController";

import AdminRepository, {
  IAdminRepository,
} from "../repositories/adminRepository";
import UserRepository, {
  IUserRepository,
} from "../repositories/userRepository";
import CommentRepository, {
  ICommentRepository,
} from "../repositories/commentsRepository";
import PostRepository, {
  IPostRepository,
} from "../repositories/postRepository";
import ReportsRepository, {
  IReportsRepository,
} from "../repositories/reportsRepository";

import UserService, { IUserService } from "../services/userService";
import AdminService, { IAdminService } from "../services/adminServices";
import CommentsServices, {
  ICommentsServices,
} from "../services/commentsServices";
import PostsServices, { IPostsServices } from "../services/postService";
import ReportsService, { IReportsService } from "../services/reportsService";

const adminRepository: IAdminRepository = new AdminRepository();
const userRepository: IUserRepository = new UserRepository();
const commentRepository: ICommentRepository = new CommentRepository();
const postRepository: IPostRepository = new PostRepository();
const reportsRepository: IReportsRepository = new ReportsRepository();

const userService: IUserService = new UserService(userRepository);
const adminService: IAdminService = new AdminService(adminRepository);
const commentsServices: ICommentsServices = new CommentsServices(
  commentRepository,
  postRepository
);
const reportsService: IReportsService = new ReportsService(reportsRepository);
const postsServices: IPostsServices = new PostsServices(postRepository);

const commentController: ICommentController = new CommentController(
  commentsServices,
  userService
);
const adminController: IAdminController = new AdminController(adminService);
const postController: IPostController = new PostController(
  postsServices,
  userService
);
const reportsController: IReportsController = new ReportsController(
  reportsService
);

export {
  commentController,
  postController,
  adminController,
  reportsController,
  userService,
  postsServices,
};
