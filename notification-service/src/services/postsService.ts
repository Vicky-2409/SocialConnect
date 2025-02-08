import { IPost } from "../models/postsCollection";
import { IPostRepository } from "../repositories/postsRepository";
import { MESSAGES } from "../utils/constants";

export interface IPostsServices {
  addPost(postData: IPost): Promise<IPost>;
}

export default class PostsServices implements IPostsServices {
  private postsRepository: IPostRepository;
  constructor(postsRepository: IPostRepository) {
    this.postsRepository = postsRepository;
  }

  async addPost(postData: IPost) {
    try {
      const post = await this.postsRepository.addPost(postData);

      if (!post) throw new Error(MESSAGES.POST_NOT_FOUND); // Use constant message
      return post;
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR_ADDING_POST);
    }
  }
}
