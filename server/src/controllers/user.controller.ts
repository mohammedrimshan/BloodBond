import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IUserService } from "../interfaces/services-interface/user-service.interface";
import { IUserController } from "../interfaces/controller-interface/user-controller.interface";
import { StatusCode } from "../constants/statusCode";
import { SUCCESS_MESSAGES } from "../constants/messages";
import { CustomRequest } from "../middlewares/auth.middleware";

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}

  getDonors = asyncHandler(async (req: Request, res: Response) => {
    const donors = await this.userService.getEligibleDonors();
    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.FETCHED_SUCCESS,
      data: donors,
    });
  });

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as CustomRequest).user.id;
    const user = await this.userService.getUserById(userId);
    res.status(StatusCode.OK).json({
      success: true,
      data: user,
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as CustomRequest).user.id;
    await this.userService.updateUserProfile(userId, req.body);
    const updatedUser = await this.userService.getUserById(userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
      data: updatedUser,
    });
  });
}
