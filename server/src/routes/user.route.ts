import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IUserController } from "../interfaces/controller-interface/user-controller.interface";
import { verifyAuth } from "../middlewares/auth.middleware";

export default function userRoutes(userController: IUserController): Router {
  const router = Router();

  router.get("/donors", asyncHandler(userController.getDonors.bind(userController)));
  router.get("/profile", verifyAuth, asyncHandler(userController.getProfile.bind(userController)));
  router.put("/profile", verifyAuth, asyncHandler(userController.updateProfile.bind(userController)));

  return router;
}
