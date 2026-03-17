import { IUser, UserDocument } from "../../types/user";

export interface IUserService {
  getEligibleDonors(): Promise<UserDocument[]>;
  getUserById(id: string): Promise<UserDocument | null>;
  updateUserProfile(id: string, data: Partial<IUser> & { profileImage?: string }): Promise<UserDocument | null>;
}
