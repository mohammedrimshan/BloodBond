import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { DonationService } from "../services/donation.service";
import { StatusCode } from "../constants/statusCode";

export class DonationController {
  constructor(private donationService: DonationService) {}

  markAsDonated = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const donation = await this.donationService.markAsDonated(userId);
    res.status(StatusCode.OK).json({ 
      success: true, 
      message: "User marked as donated successfully", 
      donation 
    });
  });

  getMyDonations = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const donations = await this.donationService.getMyDonations(userId);
    res.status(StatusCode.OK).json({ success: true, donations });
  });

  getRecentDonations = asyncHandler(async (req: Request, res: Response) => {
    const donations = await this.donationService.getRecentDonations();
    res.status(StatusCode.OK).json({ success: true, donations });
  });

  getAllDonations = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.donationService.getAllDonations(page, limit);
    res.status(StatusCode.OK).json({ success: true, ...result });
  });
}
