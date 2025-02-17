import { Model, Document, FilterQuery, UpdateQuery, Types } from "mongoose";
import logger from "../utils/logger";

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string | Types.ObjectId): Promise<T | null>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  find(filter: FilterQuery<T>): Promise<T[]>;
  update(id: string | Types.ObjectId, data: UpdateQuery<T>): Promise<T | null>;
  delete(id: string | Types.ObjectId): Promise<T | null>;
  exists(filter: FilterQuery<T>): Promise<boolean>;
  count(filter?: FilterQuery<T>): Promise<number>;
}

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const entity = new this.model(data);
      return await entity.save();
    } catch (error: any) {
      logger.error("Create error:", error);
      throw new Error(error.message);
    }
  }

  async findById(id: string | Types.ObjectId): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error: any) {
      logger.error("FindById error:", error);
      throw new Error(error.message);
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter);
    } catch (error: any) {
      logger.error("FindOne error:", error);
      throw new Error(error.message);
    }
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    try {
      return await this.model.find(filter);
    } catch (error: any) {
      logger.error("Find error:", error);
      throw new Error(error.message);
    }
  }

  async update(id: string | Types.ObjectId, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true });
    } catch (error: any) {
      logger.error("Update error:", error);
      throw new Error(error.message);
    }
  }

  async delete(id: string | Types.ObjectId): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error: any) {
      logger.error("Delete error:", error);
      throw new Error(error.message);
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      return (await this.model.exists(filter)) !== null;
    } catch (error: any) {
      logger.error("Exists error:", error);
      throw new Error(error.message);
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error: any) {
      logger.error("Count error:", error);
      throw new Error(error.message);
    }
  }
}
