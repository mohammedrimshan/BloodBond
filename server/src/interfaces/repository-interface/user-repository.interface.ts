import { UserDocument } from "../../types/user";
import { IBaseRepository } from "./base-repository.interface";

export interface IUserRepository extends IBaseRepository<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findAllEligible(): Promise<UserDocument[]>;
}
