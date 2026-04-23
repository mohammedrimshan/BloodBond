import { Router, Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { verifyAdmin, AdminRequest } from "../../middlewares/admin.middleware";
import { DonationController } from "../../controllers/donation.controller";
import { EmergencyController } from "../../controllers/emergency.controller";
import { NotificationController } from "../../controllers/notification.controller";

// Middleware to map admin identity to req.user so NotificationController works for admins
const mapAdminToUser = (req: Request, _res: Response, next: NextFunction) => {
  const admin = (req as AdminRequest).admin;
  (req as any).user = { id: admin.id, email: admin.email };
  next();
};

export default function adminRoutes(
  adminController: any,
  donationController: DonationController,
  emergencyController: EmergencyController,
  notificationController?: NotificationController
): Router {
  const router = Router();

  router.post("/auth/login", adminController.login.bind(adminController));
  router.post("/auth/logout", verifyAdmin, adminController.logout.bind(adminController));

  router.get("/users/stats", verifyAdmin, adminController.getUserStats.bind(adminController));
  router.get("/analytics", verifyAdmin, adminController.getAnalytics.bind(adminController));
  router.get("/users", verifyAdmin, adminController.getAllUsers.bind(adminController));
  router.get("/users/:id", verifyAdmin, adminController.getUserById.bind(adminController));
  router.put("/users/:id", verifyAdmin, adminController.updateUser.bind(adminController));
  router.patch("/users/:id/block", verifyAdmin, adminController.toggleBlockUser.bind(adminController));

  router.post("/users/:userId/donate", verifyAdmin, donationController.markAsDonated.bind(donationController));
  router.get("/users/:userId/donations", verifyAdmin, donationController.getUserDonations.bind(donationController));
  router.get("/donations", verifyAdmin, donationController.getAllDonations.bind(donationController));

  router.post("/emergency", verifyAdmin, emergencyController.createEmergency.bind(emergencyController));
  router.get("/emergency", verifyAdmin, emergencyController.getAllEmergencies.bind(emergencyController));
  router.put("/emergency/:id/status", verifyAdmin, emergencyController.updateEmergencyStatus.bind(emergencyController));
  router.patch("/emergency/:id/verify", verifyAdmin, emergencyController.verifyEmergency.bind(emergencyController));

  // Admin notification routes
  if (notificationController) {
    router.get("/notifications", verifyAdmin, mapAdminToUser, notificationController.getNotifications.bind(notificationController));
    router.get("/notifications/unread-count", verifyAdmin, mapAdminToUser, notificationController.getUnreadCount.bind(notificationController));
    router.patch("/notifications/:id/read", verifyAdmin, mapAdminToUser, notificationController.markAsRead.bind(notificationController));
    router.patch("/notifications/read-all", verifyAdmin, mapAdminToUser, notificationController.markAllAsRead.bind(notificationController));
  }

  return router;
}
