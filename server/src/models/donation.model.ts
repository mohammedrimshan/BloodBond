import { Schema, model, Document } from "mongoose";
import { IDonation } from "../types/donation";

export interface DonationDocument extends Document, IDonation {}

const donationSchema = new Schema<DonationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    donatedAt: { type: Date, required: true },
    nextEligibleDate: { type: Date, required: true },
    isEmergency: { type: Boolean, default: false },
    emergencyId: { type: Schema.Types.ObjectId, ref: "Emergency" },
  },
  { timestamps: true }
);

// Indexing for faster queries on user history and landing page carousel
donationSchema.index({ userId: 1, donatedAt: -1 });
donationSchema.index({ donatedAt: -1 });

export const DonationModel = model<DonationDocument>("Donation", donationSchema);
