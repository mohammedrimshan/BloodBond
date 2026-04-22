import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IUserController } from "../interfaces/controller-interface/user-controller.interface";
import { verifyAuth } from "../middlewares/auth.middleware";

export default function userRoutes(userController: IUserController): Router {
  const router = Router();

  router.get("/donors", userController.getDonors.bind(userController));
  router.get("/nearby", userController.getNearbyDonors.bind(userController));
  router.get("/profile", verifyAuth, userController.getProfile.bind(userController));
  router.put("/profile", verifyAuth, userController.updateProfile.bind(userController));

  return router;
}
