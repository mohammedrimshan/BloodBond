import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IUserController } from "../interfaces/controller-interface/user-controller.interface";

export default function userRoutes(userController: IUserController): Router {
  const router = Router();

  router.get("/donors", asyncHandler(userController.getDonors.bind(userController)));

  return router;
}
