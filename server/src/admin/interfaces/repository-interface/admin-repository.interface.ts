import { UserDocument, IUser } from "../../../types/user";

export interface GetUsersQuery {
  page: number;
  limit: number;
  search?: string;
  bloodGroup?: string;
  district?: string;
}

export interface PaginatedUsers {
  users: UserDocument[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserStats {
  total: number;
  active: number;
  blocked: number;
  verified: number;
}

export interface IAdminRepository {
  getAllUsers(query: GetUsersQuery): Promise<PaginatedUsers>;
  getUserById(id: string): Promise<UserDocument | null>;
  updateUserById(id: string, data: Partial<IUser>): Promise<UserDocument | null>;
  toggleBlockUser(id: string): Promise<UserDocument | null>;
  getUserStats(): Promise<UserStats>;
}
