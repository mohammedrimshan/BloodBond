import { Router } from "express";
import asyncHandler from "express-async-handler";
import { verifyAdmin } from "../../middlewares/admin.middleware";
import { DonationController } from "../../controllers/donation.controller";

export default function adminRoutes(adminController: any, donationController: DonationController): Router {
  const router = Router();

  router.post("/auth/login", asyncHandler(adminController.login.bind(adminController)));
  router.post("/auth/logout", verifyAdmin, asyncHandler(adminController.logout.bind(adminController)));

  router.get("/users/stats", verifyAdmin, asyncHandler(adminController.getUserStats.bind(adminController)));
  router.get("/users", verifyAdmin, asyncHandler(adminController.getAllUsers.bind(adminController)));
  router.get("/users/:id", verifyAdmin, asyncHandler(adminController.getUserById.bind(adminController)));
  router.put("/users/:id", verifyAdmin, asyncHandler(adminController.updateUser.bind(adminController)));
  router.patch("/users/:id/block", verifyAdmin, asyncHandler(adminController.toggleBlockUser.bind(adminController)));

  router.post("/users/:userId/donate", verifyAdmin, asyncHandler(donationController.markAsDonated.bind(donationController)));
  router.get("/donations", verifyAdmin, asyncHandler(donationController.getAllDonations.bind(donationController)));

  return router;
}
