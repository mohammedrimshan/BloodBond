import { DonationRepository } from "../repository/donation.repository";
import { AdminRepository } from "../admin/repositories/admin.repository";
import { Types } from "mongoose";
import { AppError } from "../utils/appError";
import { ERROR_MESSAGES } from "../constants/messages";
import { StatusCode } from "../constants/statusCode";

import { NotificationService } from "./notification.service";

export class DonationService {
  constructor(
    private donationRepository: DonationRepository,
    private adminRepository: AdminRepository,
    private notificationService: NotificationService
  ) {}

  async markAsDonated(userId: string, customTitle?: string, customMessage?: string, emergencyId?: string): Promise<any> {
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
      isEmergency: !!emergencyId,
      emergencyId: emergencyId ? new Types.ObjectId(emergencyId) : undefined,
    });

    await this.donationRepository.updateUserInfoAfterDonation(userId, donatedAt, nextEligibleDate);

    // Send Notification
    const formattedDate = nextEligibleDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const title = customTitle || "Donation Successful! ❤️";
    const message = customMessage || `Thank you for your life-saving contribution. You will be eligible to donate again after ${formattedDate}.`;

    await this.notificationService.sendNotification(
      userId,
      title,
      message,
      "donation_completed"
    );

    return donation;
  }

  async getMyDonations(userId: string): Promise<any[]> {
    return this.donationRepository.findByUserId(userId);
  }

  async getUserDonations(userId: string, startDate?: string, endDate?: string): Promise<any[]> {
    return this.donationRepository.findByUserIdWithFilters(userId, startDate, endDate);
  }

  async getRecentDonations(): Promise<any[]> {
    return this.donationRepository.findRecent(10);
  }

  async getAllDonations(page: number, limit: number): Promise<any> {
    return this.donationRepository.findAll(page, limit);
  }

  async getCertificateData(donationId: string): Promise<any> {
    const donation = await this.donationRepository.findByIdWithUser(donationId);
    if (!donation) {
      throw new AppError("Donation record not found", StatusCode.NOT_FOUND);
    }
    return donation;
  }
}
