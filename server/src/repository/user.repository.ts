import { BaseRepository } from "./base.respository";
import { UserModel } from "../models/user.model";
import { UserDocument } from "../types/user";
import { IUserRepository } from "../interfaces/repository-interface/user-repository.interface";

export class UserRepository
  extends BaseRepository<UserDocument>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email }).exec();
  }

  async findAllEligible(): Promise<UserDocument[]> {
    return this.model.find({}).exec();
  }
}
