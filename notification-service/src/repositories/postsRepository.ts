import postsCollection, { IPost } from "../models/postsCollection";
import { MESSAGES } from "../utils/constants";

export interface IPostRepository {
  addPost(postData: IPost): Promise<IPost>;
}

export default class PostRepository implements IPostRepository {
  async addPost(postData: IPost) {
    try {
      return await postsCollection.create(postData);
    } catch (error: any) {
      throw new Error(MESSAGES.POST_CREATION_ERROR);
    }
  }
}
