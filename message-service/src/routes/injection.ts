import UserRepository, {
  IUserRepository,
} from "../repositories/userRepository";
import MessageRepository, {
  IMessageRepository,
} from "../repositories/messageRepository";
import UserService, { IUserService } from "../services/userServices";
import MessageServices, { IMessageServices } from "../services/messageServices";
import MessageController, {
  IMessageController,
} from "../controllers/messageControllers";

const userRepository: IUserRepository = new UserRepository();
const messageRepository: IMessageRepository = new MessageRepository();

const userService: IUserService = new UserService(userRepository);
const messageService: IMessageServices = new MessageServices(messageRepository);

const messageControllers: IMessageController = new MessageController(
  messageService
);

export { messageControllers, userService };
