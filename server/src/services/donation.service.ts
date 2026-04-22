import { DonationRepository } from "../repository/donation.repository";
import { AdminRepository } from "../admin/repositories/admin.repository";
import { Types } from "mongoose";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";

export class DonationService {
  constructor(
    private donationRepository: DonationRepository,
    private adminRepository: AdminRepository
  ) {}

  async markAsDonated(userId: string): Promise<any> {
    const user = await this.adminRepository.getUserById(userId);
    if (!user) {
      throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    if (!user.isEligible) {
      throw new AppError("User is not eligible to donate yet. Please wait for the 3-month period to end.", StatusCode.BAD_REQUEST);
    }

    const donatedAt = new Date();
    const nextEligibleDate = new Date(donatedAt);
    nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3);

    const donation = await this.donationRepository.createDonation({
      userId: user._id as Types.ObjectId,
      donatedAt,
      nextEligibleDate,
    });

    await this.donationRepository.updateUserInfoAfterDonation(userId, donatedAt, nextEligibleDate);

    return donation;
  }

  async getMyDonations(userId: string): Promise<any[]> {
    return this.donationRepository.findByUserId(userId);
  }

  async getRecentDonations(): Promise<any[]> {
    return this.donationRepository.findRecent(10);
  }

  async getAllDonations(page: number, limit: number): Promise<any> {
    return this.donationRepository.findAll(page, limit);
  }
}
