import { Request, Response } from "express";
import { DonationService } from "../services/donation.service";
import { StatusCode } from "../constants/statusCode";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants/messages";
import { AppError } from "../utils/appError";

export class DonationController {
  constructor(private donationService: DonationService) {}

  async markAsDonated(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const donation = await this.donationService.markAsDonated(userId);
      res.status(StatusCode.OK).json({ 
        success: true, 
        message: "User marked as donated successfully", 
        donation 
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  }

  async getMyDonations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const donations = await this.donationService.getMyDonations(userId);
      res.status(StatusCode.OK).json({ success: true, donations });
    } catch {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }

  async getRecentDonations(req: Request, res: Response): Promise<void> {
    try {
      const donations = await this.donationService.getRecentDonations();
      res.status(StatusCode.OK).json({ success: true, donations });
    } catch {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }

  async getAllDonations(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.donationService.getAllDonations(page, limit);
      res.status(StatusCode.OK).json({ success: true, ...result });
    } catch {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
    }
  }
}
