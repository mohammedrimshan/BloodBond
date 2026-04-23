import { NotificationRepository } from "../repository/notification.repository";
import { SocketService } from "./socket.service";
import { INotification, NotificationDocument } from "../models/notification.model";

import { UserRepository } from "../repository/user.repository";

export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private socketService: SocketService,
    private userRepository: UserRepository
  ) {}

  async sendNotification(userId: string, title: string, message: string, type: INotification["type"], link?: string): Promise<NotificationDocument> {
    const notification = await this.notificationRepository.create({
      userId: userId as any,
      title,
      message,
      type,
      link,
    });

    // Emit via socket to the user's room
    this.socketService.sendToUser(userId, "new_notification", notification);

    return notification;
  }

  async notifyAdmins(title: string, message: string, type: INotification["type"], link?: string): Promise<void> {
    const admins = await this.userRepository.findByRole("admin");
    
    const notifications = await Promise.all(
      admins.map((admin) => 
        this.notificationRepository.create({
          userId: admin._id as any,
          title,
          message,
          type,
          link,
        })
      )
    );

    // Broadcast to the admin room
    this.socketService.sendToUser("admin", "new_notification", notifications[0]); // Emit once to the role room
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
