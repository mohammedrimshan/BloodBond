import cron from "node-cron";
import { UserModel } from "../models/user.model";
import { sendReminderEmail } from "../services/email.service";

/**
 * Daily CRON job to check for donation eligibility
 * Runs every day at 00:00 (Midnight)
 */
export const initRemindersCron = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running Daily Eligibility Check CRON Job...");
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Find users whose eligibility date is today and are not yet marked as eligible
      const eligibleToday = await UserModel.find({
        nextEligibleDate: { 
          $gte: today, 
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
        },
        isEligible: false
      });

      console.log(`Found ${eligibleToday.length} users becoming eligible today.`);

      for (const user of eligibleToday) {
        // Update eligibility in DB
        user.isEligible = true;
        await user.save();

        // Send email reminder
        await sendReminderEmail(user.email, user.name);
        console.log(`✅ Eligibility updated and reminder sent to: ${user.email}`);
      }

    } catch (error) {
      console.error("❌ CRON Job Error:", error);
    }
  });
  
  console.log("✅ Donation Reminders CRON Job Initialized");
};
