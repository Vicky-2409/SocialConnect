// import postsCollection, { IPost } from "../models/postsCollection";
// import { MESSAGES } from "../utils/constants";

// export default class PostRepository implements IPostRepository {
//   async addPost(postData: IPost) {
//     try {
//       return await postsCollection.create(postData);
//     } catch (error: any) {
//       throw new Error(MESSAGES.POST_CREATION_ERROR);
//     }
//   }
// }

import postsCollection, { IPost } from "../models/postsCollection";
import { MESSAGES } from "../utils/constants";
import { BaseRepository } from "./baseRepository";

export interface IPostRepository {
  addPost(postData: IPost): Promise<IPost>;
}
export default class PostRepository extends BaseRepository<IPost> implements IPostRepository {
  constructor() {
    super(postsCollection); // Pass the postsCollection model to the BaseRepository
  }

  // If you want to customize the addPost method with specific error handling, you can override it
  async addPost(postData: IPost): Promise<IPost> {
    try {
      return await this.create(postData); // Use the create method from BaseRepository
    } catch (error: any) {
      throw new Error(MESSAGES.POST_CREATION_ERROR); // Custom error message
    }
  }
}
