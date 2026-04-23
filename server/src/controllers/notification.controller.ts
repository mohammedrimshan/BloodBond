import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { NotificationService } from "../services/notification.service";
import { StatusCode } from "../constants/statusCode";
import { CustomRequest } from "../middlewares/auth.middleware";

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as CustomRequest).user.id;
    const notifications = await this.notificationService.getUserNotifications(userId);
    res.status(StatusCode.OK).json({ success: true, data: notifications });
  });

  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as CustomRequest).user.id;
    const count = await this.notificationService.getUnreadCount(userId);
    res.status(StatusCode.OK).json({ success: true, data: { count } });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.notificationService.markAsRead(id);
    res.status(StatusCode.OK).json({ success: true, message: "Notification marked as read" });
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as CustomRequest).user.id;
    await this.notificationService.markAllAsRead(userId);
    res.status(StatusCode.OK).json({ success: true, message: "All notifications marked as read" });
  });
}
