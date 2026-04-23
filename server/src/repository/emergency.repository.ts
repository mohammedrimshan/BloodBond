import { EmergencyModel, IEmergency, EmergencyStatus } from "../models/emergency.model";
import { Types } from "mongoose";

export class EmergencyRepository {
  async createRequest(data: Partial<IEmergency>): Promise<IEmergency> {
    const request = new EmergencyModel(data);
    return await request.save();
  }

  async findById(id: string): Promise<IEmergency | null> {
    return await EmergencyModel.findById(id)
      .populate("readyUsers", "name email bloodGroup photoUrl district phoneNumber")
      .populate("completedByUser", "name email")
      .populate("requestedBy", "name phoneNumber email");
  }

  async findAll(): Promise<IEmergency[]> {
    return await EmergencyModel.find()
      .populate("readyUsers", "name email bloodGroup photoUrl district phoneNumber")
      .populate("completedByUser", "name email")
      .populate("requestedBy", "name phoneNumber email")
      .sort({ createdAt: -1 });
  }

  async addReadyUser(requestId: string, userId: string): Promise<IEmergency | null> {
    return await EmergencyModel.findByIdAndUpdate(
      requestId,
      { $addToSet: { readyUsers: new Types.ObjectId(userId) } },
      { new: true }
    );
  }

  async updateStatusAndComplete(requestId: string, status: EmergencyStatus, completedByUserId?: string): Promise<IEmergency | null> {
    const updateData: any = { status };
    if (completedByUserId) {
      updateData.completedByUser = new Types.ObjectId(completedByUserId);
    }
    return await EmergencyModel.findByIdAndUpdate(requestId, updateData, { new: true });
  }
}
