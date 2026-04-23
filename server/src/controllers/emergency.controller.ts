import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { EmergencyService } from "../services/emergency.service";
import { StatusCode } from "../constants/statusCode";

export class EmergencyController {
  constructor(private emergencyService: EmergencyService) {}

  createEmergency = asyncHandler(async (req: Request, res: Response) => {
    const { patientName, hospitalName, bloodGroup } = req.body;
    const request = await this.emergencyService.createEmergency({ patientName, hospitalName, bloodGroup });
    res.status(StatusCode.CREATED).json({ success: true, message: "Emergency request created and users notified", request });
  });

  getAllEmergencies = asyncHandler(async (req: Request, res: Response) => {
    const requests = await this.emergencyService.getAllEmergencies();
    res.status(StatusCode.OK).json({ success: true, requests });
  });

  updateEmergencyStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, completedByUserId } = req.body;
    const request = await this.emergencyService.completeEmergency(id, status, completedByUserId);
    res.status(StatusCode.OK).json({ success: true, message: "Emergency status updated", request });
  });

  markReady = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const request = await this.emergencyService.markUserReady(id, userId);
    res.status(StatusCode.OK).json({ success: true, message: "You have been marked as ready for this emergency.", request });
  });
}
