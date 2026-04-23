import { NotificationModel, NotificationDocument, INotification } from "../models/notification.model";
import { Types } from "mongoose";

export class NotificationRepository {
  async create(data: Partial<INotification>): Promise<NotificationDocument> {
    return await NotificationModel.create(data);
  }

  async findByUserId(userId: string): Promise<NotificationDocument[]> {
    return await NotificationModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async markAsRead(notificationId: string): Promise<NotificationDocument | null> {
    return await NotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    ).exec();
  }

  async markAllAsRead(userId: string): Promise<any> {
    return await NotificationModel.updateMany(
      { userId: new Types.ObjectId(userId), isRead: false },
      { isRead: true }
    ).exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
    });
  }
}
