import { Response } from "express";
import { UserDocument, IUser } from "../../../types/user";
import { GetUsersQuery, PaginatedUsers, UserStats } from "../repository-interface/admin-repository.interface";

export interface IAdminService {
  login(email: string, password: string, res: Response): Promise<UserDocument>;
  logout(res: Response): Promise<void>;
  getAllUsers(query: GetUsersQuery): Promise<PaginatedUsers>;
  getUserStats(): Promise<UserStats>;
  getUserById(id: string): Promise<UserDocument>;
  updateUser(id: string, data: Partial<IUser>): Promise<UserDocument>;
  toggleBlockUser(id: string): Promise<UserDocument>;
}
