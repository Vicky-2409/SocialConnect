import postsCollection, { IPost } from "../models/postsCollection";
import logger from "../utils/logger";

export interface IPostRepository {
  addPost(postData: IPost): Promise<IPost>;
}

export default class PostRepository implements IPostRepository {
  async addPost(postData: IPost) {
    try {
      logger.info("Adding a new post", { postData });

      return await postsCollection.create(postData);
    } catch (error: any) {
      logger.error("Error adding post", { error: error.message });

      throw new Error(error.message);
    }
  }
}
