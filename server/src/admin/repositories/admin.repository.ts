import { UserModel } from "../../models/user.model";
import { UserDocument, IUser } from "../../types/user";
import {
  IAdminRepository,
  GetUsersQuery,
  PaginatedUsers,
  UserStats,
} from "../interfaces/repository-interface/admin-repository.interface";

export class AdminRepository implements IAdminRepository {
  async getAllUsers(query: GetUsersQuery): Promise<PaginatedUsers> {
    const { page, limit, search, bloodGroup, district } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { role: { $ne: "admin" } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (district) filter.district = { $regex: district, $options: "i" };

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(filter),
    ]);

    return {
      users: users as unknown as UserDocument[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).select("-password").lean() as Promise<UserDocument | null>;
  }

  async updateUserById(
    id: string,
    data: Partial<IUser>
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true })
      .select("-password")
      .lean() as Promise<UserDocument | null>;
  }

  async toggleBlockUser(id: string): Promise<UserDocument | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    user.isBlocked = !user.isBlocked;
    await user.save();
    return user;
  }

  async getUserStats(): Promise<UserStats> {
    const [total, blocked, verified] = await Promise.all([
      UserModel.countDocuments({ role: { $ne: "admin" } }),
      UserModel.countDocuments({ role: { $ne: "admin" }, isBlocked: true }),
      UserModel.countDocuments({ role: { $ne: "admin" }, isVerified: true }),
    ]);

    return {
      total,
      active: total - blocked,
      blocked,
      verified,
    };
  }
}
