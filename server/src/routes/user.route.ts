import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IUserController } from "../interfaces/controller-interface/user-controller.interface";
import { verifyAuth } from "../middlewares/auth.middleware";
import { EmergencyController } from "../controllers/emergency.controller";

export default function userRoutes(userController: IUserController, emergencyController: EmergencyController): Router {
  const router = Router();

  router.get("/donors", userController.getDonors.bind(userController));
  router.get("/nearby", userController.getNearbyDonors.bind(userController));
  router.get("/profile", verifyAuth, userController.getProfile.bind(userController));
  router.put("/profile", verifyAuth, userController.updateProfile.bind(userController));

  router.post("/emergency/:id/ready", verifyAuth, emergencyController.markReady.bind(emergencyController));

  return router;
}
