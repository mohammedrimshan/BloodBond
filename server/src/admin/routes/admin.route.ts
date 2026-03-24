import { Router } from "express";
import asyncHandler from "express-async-handler";
import { IAdminController } from "../interfaces/controller-interface/admin-controller.interface";
import { verifyAdmin } from "../../middlewares/admin.middleware";

export default function adminRoutes(adminController: IAdminController): Router {
  const router = Router();

  router.post("/auth/login", asyncHandler(adminController.login.bind(adminController)));
  router.post("/auth/logout", verifyAdmin, asyncHandler(adminController.logout.bind(adminController)));

  router.get("/users/stats", verifyAdmin, asyncHandler(adminController.getUserStats.bind(adminController)));
  router.get("/users", verifyAdmin, asyncHandler(adminController.getAllUsers.bind(adminController)));
  router.get("/users/:id", verifyAdmin, asyncHandler(adminController.getUserById.bind(adminController)));
  router.put("/users/:id", verifyAdmin, asyncHandler(adminController.updateUser.bind(adminController)));
  router.patch("/users/:id/block", verifyAdmin, asyncHandler(adminController.toggleBlockUser.bind(adminController)));

  return router;
}
