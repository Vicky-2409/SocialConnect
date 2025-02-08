import UserRepository, {
  IUserRepository,
} from "../repositories/userRepository";
import PostRepository, {
  IPostRepository,
} from "../repositories/postsRepository";
import NotificationRepository, {
  INotificationRepository,
} from "../repositories/notificationRepository";

import UserService, { IUserService } from "../services/userServices";
import PostsServices, { IPostsServices } from "../services/postsService";
import NotificationServices, {
  INotificationServices,
} from "../services/notificationServices";

import NotificationController, {
  INotificationController,
} from "../controllers/notificationController";

const userRepository: IUserRepository = new UserRepository();
const postRepository: IPostRepository = new PostRepository();
const notificationRepository: INotificationRepository =
  new NotificationRepository();

const userService: IUserService = new UserService(userRepository);
const postsService: IPostsServices = new PostsServices(postRepository);
const notificationService: INotificationServices = new NotificationServices(
  notificationRepository
);

const notificationController: INotificationController =
  new NotificationController(notificationService);

export {
  notificationController,
  postsService,
  userService,
  notificationService,
};
