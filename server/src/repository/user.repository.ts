import mongoose from "mongoose";
import { BaseRepository } from "./base.respository";
import { UserModel } from "../models/user.model";
import { UserDocument, IUser } from "../types/user";
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

  async findByRole(role: string): Promise<UserDocument[]> {
    return this.model.find({ role }).exec();
  }

  async findAllEligible(): Promise<any[]> {
    return this.model.aggregate([
      {
        $lookup: {
          from: "donations",
          localField: "_id",
          foreignField: "userId",
          as: "donations",
        },
      },
      {
        $addFields: {
          totalDonations: { $size: "$donations" },
        },
      },
      {
        $project: {
          password: 0,
          donations: 0,
        },
      },
    ]);
  }

  async findNearbyDonors(lat: number, lng: number, radiusInKm: number): Promise<any[]> {
    const radiusInRadians = radiusInKm / 6378.1;
    return this.model.aggregate([
      {
        $match: {
          isEligible: true,
          location: {
            $geoWithin: {
              $centerSphere: [[lng, lat], radiusInRadians]
            }
          }
        }
      },
      {
        $lookup: {
          from: "donations",
          localField: "_id",
          foreignField: "userId",
          as: "donations",
        },
      },
      {
        $addFields: {
          totalDonations: { $size: "$donations" },
        },
      },
      {
        $project: {
          password: 0,
          donations: 0,
        },
      },
    ]);
  }

  async updateUser(
    id: string,
    data: Partial<IUser>
  ): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async getBloodGroupStats(): Promise<{ _id: string; count: number }[]> {
    return this.model.aggregate([
      { $match: { bloodGroup: { $ne: null } } },
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
  }

  async getUserGrowthStats(): Promise<{ _id: { month: number; year: number }; count: number }[]> {
    return this.model.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
  }

  async getPublicProfile(id: string): Promise<any> {
    const user = await this.model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "donations",
          localField: "_id",
          foreignField: "userId",
          as: "donations",
        },
      },
      {
        $addFields: {
          totalDonations: { $size: "$donations" },
        },
      },
      {
        $project: {
          password: 0,
          role: 0,
          donations: 0,
        },
      },
    ]);

    return user.length ? user[0] : null;
  }
}
