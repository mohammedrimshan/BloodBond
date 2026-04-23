import { IUser, UserDocument } from "../../types/user";
import { IBaseRepository } from "./base-repository.interface";

export interface IUserRepository extends IBaseRepository<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
  findByRole(role: string): Promise<UserDocument[]>;
  findAllEligible(): Promise<any[]>;
  updateUser(id: string, data: Partial<IUser>): Promise<UserDocument | null>;
  findNearbyDonors(lat: number, lng: number, radiusInKm: number): Promise<any[]>;
  getBloodGroupStats(): Promise<{ _id: string; count: number }[]>;
  getUserGrowthStats(): Promise<{ _id: { month: number; year: number }; count: number }[]>;
  getPublicProfile(id: string): Promise<any>;
}
