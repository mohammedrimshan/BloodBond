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

  async findAllEligible(): Promise<UserDocument[]> {
    return this.model.find({}).exec();
  }

  async findNearbyDonors(lat: number, lng: number, radiusInKm: number): Promise<UserDocument[]> {
    const radiusInRadians = radiusInKm / 6378.1; // Convert km to radians for MongoDB
    const donors = await this.model.find({
      isEligible: true,
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians]
        }
      }
    }).exec();
    
    console.log(`📍 Nearby Search Found ${donors.length} donors.`);
    donors.forEach(d => console.log(`   - ID: ${d._id}, Name: ${d.name}, Role: ${d.role}, Blocked: ${d.isBlocked}`));
    return donors;
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
}
