import { DonationModel, DonationDocument } from "../models/donation.model";
import { UserModel } from "../models/user.model";
import { IDonation } from "../types/donation";
import { Types } from "mongoose";

export class DonationRepository {
  async createDonation(data: IDonation): Promise<DonationDocument> {
    const donation = new DonationModel(data);
    return await donation.save();
  }

  async findByUserId(userId: string): Promise<DonationDocument[]> {
    return (await DonationModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ donatedAt: -1 })
      .lean()) as unknown as DonationDocument[];
  }

  async findByUserIdWithFilters(userId: string, startDate?: string, endDate?: string): Promise<DonationDocument[]> {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (startDate || endDate) {
      query.donatedAt = {};
      if (startDate) {
        query.donatedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.donatedAt.$lte = end;
      }
    }

    return (await DonationModel.find(query)
      .sort({ donatedAt: -1 })
      .lean()) as unknown as DonationDocument[];
  }

  async findRecent(limit: number): Promise<any[]> {
    return DonationModel.aggregate([
      { $sort: { donatedAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "donations",
          localField: "userId",
          foreignField: "userId",
          as: "allDonations",
        },
      },
      {
        $addFields: {
          "user.totalDonations": { $size: "$allDonations" },
        },
      },
      {
        $project: {
          allDonations: 0,
          "user.password": 0,
        },
      },
      {
        $addFields: {
          userId: "$user",
        }
      },
      {
        $project: {
          user: 0
        }
      }
    ]);
  }

  async findAll(page: number, limit: number): Promise<{ donations: DonationDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const [donations, total] = await Promise.all([
      DonationModel.find()
        .populate("userId", "name email bloodGroup")
        .sort({ donatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DonationModel.countDocuments(),
    ]);

    return { 
      donations: donations as unknown as DonationDocument[], 
      total 
    };
  }

  async updateUserInfoAfterDonation(userId: string, date: Date, nextDate: Date): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      lastDonatedDate: date,
      nextEligibleDate: nextDate,
      isEligible: false,
    });
  }

  async findByIdWithUser(id: string): Promise<any> {
    return DonationModel.findById(id).populate("userId", "name email bloodGroup photoUrl").lean();
  }
}
