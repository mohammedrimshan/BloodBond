import { IUser, UserDocument } from "../../types/user";
import { IBaseRepository } from "./base-repository.interface";

export interface IUserRepository extends IBaseRepository<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findAllEligible(): Promise<UserDocument[]>;
  updateUser(id: string, data: Partial<IUser>): Promise<UserDocument | null>;
  findNearbyDonors(lat: number, lng: number, radiusInKm: number): Promise<UserDocument[]>;
  getBloodGroupStats(): Promise<{ _id: string; count: number }[]>;
  getUserGrowthStats(): Promise<{ _id: { month: number; year: number }; count: number }[]>;
}
