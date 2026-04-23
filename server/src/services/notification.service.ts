import { NotificationRepository } from "../repository/notification.repository";
import { SocketService } from "./socket.service";
import { INotification, NotificationDocument } from "../models/notification.model";

export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private socketService: SocketService
  ) {}

  async sendNotification(userId: string, title: string, message: string, type: INotification["type"]): Promise<NotificationDocument> {
    const notification = await this.notificationRepository.create({
      userId: userId as any,
      title,
      message,
      type,
    });

    // Emit via socket to the user's room
    this.socketService.sendToUser(userId, "new_notification", notification);

    return notification;
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepository.findByUserId(userId);
  }

  async markAsRead(notificationId: string) {
    return this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    return this.notificationRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string) {
    return this.notificationRepository.getUnreadCount(userId);
  }
}
