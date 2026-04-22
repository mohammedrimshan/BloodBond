import cron from "node-cron";
import { UserModel } from "../models/user.model";
import { DonationModel } from "../models/donation.model";
import { sendReminderEmail } from "../services/email.service";

/**
 * Daily CRON job to check for donation eligibility
 * Runs every day at 00:00 (Midnight)
 */
export const initRemindersCron = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running Daily Eligibility Check CRON Job...");
    
    try {
      const now = new Date();

      // 1. Find all donations where the eligibility date has passed
      // We populate the userId to get the user details directly
      const passedDonations = await DonationModel.find({
        nextEligibleDate: { $lte: now }
      }).populate("userId");

      console.log(`Checking ${passedDonations.length} historical donations for eligibility updates...`);

      const processedUserIds = new Set();

      for (const donation of passedDonations) {
        try {
          const user = donation.userId as any;
          
          // Skip if user was already processed in this run or doesn't exist
          if (!user || processedUserIds.has(user._id.toString())) continue;

          // Only process if the user is currently marked as ineligible
          if (user.isEligible === false) {
            // Update eligibility in DB
            await UserModel.findByIdAndUpdate(user._id, { isEligible: true });

            // Send email reminder
            await sendReminderEmail(user.email, user.name);
            console.log(`✅ Eligibility updated and reminder sent to: ${user.email}`);
            
            // Mark as processed to avoid double-processing if they have multiple old donations
            processedUserIds.add(user._id.toString());
          }
        } catch (err) {
          console.error(`❌ Failed to process donation ${donation._id}:`, err);
        }
      }

    } catch (error) {
      console.error("❌ CRON Job Error:", error);
    }
  });
  
  console.log("✅ Donation Reminders CRON Job Initialized");
};
