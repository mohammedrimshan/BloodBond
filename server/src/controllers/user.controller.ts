import { Request, Response, NextFunction } from "express";
import { IUserService } from "../interfaces/services-interface/user-service.interface";
import { IUserController } from "../interfaces/controller-interface/user-controller.interface";
import { StatusCode } from "../constants/statusCode";
import { SUCCESS_MESSAGES } from "../constants/messages";
import { CustomRequest } from "../middlewares/auth.middleware";

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}

  async getDonors(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const donors = await this.userService.getEligibleDonors();
      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.FETCHED_SUCCESS,
        data: donors,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.id;
      const user = await this.userService.getUserById(userId);
      res.status(StatusCode.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.id;
      await this.userService.updateUserProfile(userId, req.body);
      
      // Fetch fresh user data to ensure all fields are synchronized
      const updatedUser = await this.userService.getUserById(userId);

      res.status(StatusCode.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}
