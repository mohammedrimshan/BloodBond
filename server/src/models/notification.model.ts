import { Schema, model, Document, Types } from "mongoose";

export interface INotification {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: "eligibility" | "donation_completed" | "emergency_completed" | "emergency_verification" | "general";
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

export interface NotificationDocument extends Document, INotification {}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["eligibility", "donation_completed", "emergency_completed", "emergency_verification", "general"],
      default: "general",
    },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const NotificationModel = model<NotificationDocument>("Notification", notificationSchema);
