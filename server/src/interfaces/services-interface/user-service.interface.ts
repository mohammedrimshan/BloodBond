import { IUser, UserDocument } from "../../types/user";

export interface IUserService {
  getEligibleDonors(): Promise<any[]>;
  getUserById(id: string): Promise<UserDocument | null>;
  updateUserProfile(id: string, data: Partial<IUser> & { profileImage?: string }): Promise<UserDocument | null>;
  getNearbyDonors(lat: number, lng: number, radius: number): Promise<any[]>;
  getPublicProfile(id: string): Promise<any>;
}
