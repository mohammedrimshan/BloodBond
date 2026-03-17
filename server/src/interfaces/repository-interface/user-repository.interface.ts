import { IUser, UserDocument } from "../../types/user";
import { IBaseRepository } from "./base-repository.interface";

export interface IUserRepository extends IBaseRepository<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findAllEligible(): Promise<UserDocument[]>;
  updateUser(id: string, data: Partial<IUser>): Promise<UserDocument | null>;
}
