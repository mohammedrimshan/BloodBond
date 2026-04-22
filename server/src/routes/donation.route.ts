import { Router } from "express";
import asyncHandler from "express-async-handler";
import { DonationController } from "../controllers/donation.controller";
import { verifyAuth } from "../middlewares/auth.middleware";

export default function donationRoutes(donationController: DonationController): Router {
  const router = Router();

  // Public endpoint for landing page carousel
  router.get("/recent", asyncHandler(donationController.getRecentDonations.bind(donationController)));

  // User history endpoint
  router.get("/me", verifyAuth, asyncHandler(donationController.getMyDonations.bind(donationController)));

  return router;
}
