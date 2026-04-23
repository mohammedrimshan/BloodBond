import { Router } from "express";
import asyncHandler from "express-async-handler";
import { verifyAdmin } from "../../middlewares/admin.middleware";
import { DonationController } from "../../controllers/donation.controller";
import { EmergencyController } from "../../controllers/emergency.controller";

export default function adminRoutes(adminController: any, donationController: DonationController, emergencyController: EmergencyController): Router {
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

  return router;
}
