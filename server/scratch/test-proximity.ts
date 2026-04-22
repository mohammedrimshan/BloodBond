import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "../src/models/user.model";
import { UserRepository } from "../src/repository/user.repository";

dotenv.config();

const testProximity = async () => {
  try {
    console.log("🔍 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected!");

    const userRepo = new UserRepository();

    // 1. Setup a Test Donor
    await UserModel.findOneAndUpdate(
      { email: "nearby@hero.com" },
      {
        name: "Nearby Hero (Tester)",
        phoneNumber: "1234567890",
        bloodGroup: "O+",
        isEligible: true,
        location: {
          type: "Point",
          coordinates: [76.2673, 9.9312] // Kochi, Kerala
        }
      },
      { upsert: true, new: true }
    );
    console.log("👤 Test donor created/updated at search location.");

    // 2. Define Search Center (e.g., search from a specific point)
    const myLat = 9.9312; 
    const myLng = 76.2673;
    const radius = 10; // 10km

    console.log(`📡 Searching for donors within ${radius}km of [${myLat}, ${myLng}]...`);

    const donors = await userRepo.findNearbyDonors(myLat, myLng, radius);

    if (donors.length === 0) {
      console.log("❌ No donors found within 10km. Try increasing the radius or adding a test donor with location data.");
    } else {
      console.log(`🎉 Found ${donors.length} donors!`);
      donors.forEach((d, i) => {
        console.log(`${i + 1}. ${d.name} (${d.bloodGroup}) - ${d.place || 'Unknown Place'}`);
      });
    }

  } catch (error) {
    console.error("❌ Test Failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

testProximity();
