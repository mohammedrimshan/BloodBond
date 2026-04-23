import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

export default function notificationRoutes(controller: NotificationController): Router {
  const router = Router();

  router.use(verifyAuth);

  router.get("/", controller.getNotifications.bind(controller));
  router.get("/unread-count", controller.getUnreadCount.bind(controller));
  router.patch("/:id/read", controller.markAsRead.bind(controller));
  router.patch("/read-all", controller.markAllAsRead.bind(controller));

  return router;
}
