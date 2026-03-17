import { Request, Response, NextFunction } from "express";
import { IUserService } from "../interfaces/services-interface/user-service.interface";
import { IUserController } from "../interfaces/controller-interface/user-controller.interface";
import { StatusCode } from "../constants/statusCode";
import { SUCCESS_MESSAGES } from "../constants/messages";

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
}
