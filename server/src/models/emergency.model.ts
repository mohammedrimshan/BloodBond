import mongoose, { Document, Schema, Types } from "mongoose";

export enum EmergencyStatus {
  PENDING_VERIFICATION = "Pending Verification",
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  REJECTED = "Rejected",
}

export interface IEmergency extends Document {
  patientName: string;
  hospitalName: string;
  bloodGroup: string;
  status: EmergencyStatus;
  requestedBy?: Types.ObjectId; // User who requested if not admin
  readyUsers: Types.ObjectId[];
  completedByUser?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const emergencySchema = new Schema<IEmergency>(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(EmergencyStatus),
      default: EmergencyStatus.PENDING,
    },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    readyUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    completedByUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const EmergencyModel = mongoose.model<IEmergency>("Emergency", emergencySchema);
