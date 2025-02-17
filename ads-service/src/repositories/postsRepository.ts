// import postsCollection, { IPost } from "../models/postsCollection";
// import logger from "../utils/logger";

// export interface IPostRepository {
//   addPost(postData: IPost): Promise<IPost>;
// }

// export default class PostRepository implements IPostRepository {
//   async addPost(postData: IPost) {
//     try {
//       logger.info("Adding a new post", { postData });

//       return await postsCollection.create(postData);
//     } catch (error: any) {
//       logger.error("Error adding post", { error: error.message });

//       throw new Error(error.message);
//     }
//   }
// }

















import { BaseRepository } from "./baseRepository";
import postsCollection, { IPost } from "../models/postsCollection";
import logger from "../utils/logger";

export interface IPostRepository {
  addPost(postData: IPost): Promise<IPost>;
}

export default class PostRepository extends BaseRepository<IPost> implements IPostRepository {
  constructor() {
    super(postsCollection);
  }

  async addPost(postData: IPost): Promise<IPost> {
    try {
      logger.info("Adding a new post", { postData });
      
      return await this.create(postData);
    } catch (error: any) {
      logger.error("Error adding post", { error: error.message });
      throw new Error(error.message);
    }
  }
}