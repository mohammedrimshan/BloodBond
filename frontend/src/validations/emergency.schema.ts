import { z } from "zod";

export const emergencySchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters").max(50, "Patient name is too long"),
  hospitalName: z.string().min(2, "Hospital name must be at least 2 characters").max(200, "Hospital name is too long"),
  bloodGroup: z.string().min(1, "Blood group is required"),
});

export type EmergencyFormData = z.infer<typeof emergencySchema>;
