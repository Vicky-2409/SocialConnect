import { IPost } from "../models/postsCollection";
import { IPostRepository } from "../repositories/postsRepository";
import logger from "../utils/logger";

export interface IPostService {
  addPost(postData: IPost): Promise<IPost>;
}

export default class PostService implements IPostService {
  private postsRepository: IPostRepository;
  constructor(postsRepository: IPostRepository) {
    this.postsRepository = postsRepository;
  }
  async addPost(postData: IPost) {
    try {
      logger.info("Adding new post", { postData });
      return await this.postsRepository.addPost(postData);
    } catch (error: any) {
      logger.error(`Error in addPost: ${error.message}`, { error });
      throw new Error(error.message);
    }
  }
}
