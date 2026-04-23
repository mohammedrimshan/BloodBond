import { EmergencyRepository } from "../repository/emergency.repository";
import { SocketService } from "./socket.service";
import { DonationService } from "./donation.service";
import { UserRepository } from "../repository/user.repository";
import { EmergencyStatus } from "../models/emergency.model";
import { AppError } from "../utils/appError";
import { StatusCode } from "../constants/statusCode";
import { ERROR_MESSAGES } from "../constants/messages";

export class EmergencyService {
  constructor(
    private emergencyRepository: EmergencyRepository,
    private socketService: SocketService,
    private donationService: DonationService,
    private userRepository: UserRepository
  ) {}

  async createEmergency(data: { patientName: string; hospitalName: string; bloodGroup: string }) {
    const request = await this.emergencyRepository.createRequest(data);

    // Find eligible users with the matching blood group
    const users = await this.userRepository.findByRole("user");
    console.log(`[Emergency] Total users with role 'user': ${users.length}`);
    
    // Debug log to see available users
    users.forEach((u: any) => {
      console.log(`[Emergency Debug] User: ${u.email} | Blood: ${u.bloodGroup} | Eligible: ${u.isEligible}`);
    });

    const eligibleUsers = users.filter((user: any) => user.bloodGroup === data.bloodGroup && user.isEligible);
    console.log(`[Emergency] Eligible users for ${data.bloodGroup}: ${eligibleUsers.length}`);
    
    const userIds = eligibleUsers.map((user: any) => (user._id as string).toString());

    // Emit socket event to those users
    this.socketService.notifyEligibleUsers(userIds, {
      id: request._id,
      hospitalName: request.hospitalName,
      bloodGroup: request.bloodGroup,
      message: `Urgent requirement for ${request.bloodGroup} blood at ${request.hospitalName}.`,
    });

    return request;
  }

  async markUserReady(requestId: string, userId: string) {
    const request = await this.emergencyRepository.findById(requestId);
    if (!request) {
      throw new AppError("Emergency request not found", StatusCode.NOT_FOUND);
    }
    if (request.status === EmergencyStatus.COMPLETED) {
      throw new AppError("This request has already been completed.", StatusCode.BAD_REQUEST);
    }
    
    // Check if user is eligible (though we only notified eligible users, they could have changed)
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isEligible) {
      throw new AppError("You are not eligible to donate.", StatusCode.FORBIDDEN);
    }

    const updatedRequest = await this.emergencyRepository.addReadyUser(requestId, userId);
    
    // Optionally notify admin that someone is ready via socket
    // this.socketService.notifyAdmins("emergency_request_updated", updatedRequest);

    return updatedRequest;
  }

  async completeEmergency(requestId: string, status: EmergencyStatus, completedByUserId?: string) {
    const request = await this.emergencyRepository.findById(requestId);
    if (!request) {
      throw new AppError("Emergency request not found", StatusCode.NOT_FOUND);
    }

    let userToMarkDonated = completedByUserId;

    if (status === EmergencyStatus.COMPLETED && !userToMarkDonated) {
      throw new AppError("Must select a user who completed the donation when marking as completed.", StatusCode.BAD_REQUEST);
    }

    const updatedRequest = await this.emergencyRepository.updateStatusAndComplete(requestId, status, userToMarkDonated);

    if (status === EmergencyStatus.COMPLETED && userToMarkDonated) {
      // Create a donation record for the user and update their eligibility
      await this.donationService.markAsDonated(userToMarkDonated);
    }

    return updatedRequest;
  }

  async getAllEmergencies() {
    return await this.emergencyRepository.findAll();
  }
}
