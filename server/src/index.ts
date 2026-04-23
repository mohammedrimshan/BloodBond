import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.route";
import { UserRepository } from "./repository/user.repository";
import { OtpRepository } from "./repository/otp.repository";
import { OtpService } from "./services/otp.generate.service";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { CloudinaryService } from "./services/cloudinary.service";
import userRoutes from "./routes/user.route";
import asyncHandler from "express-async-handler";
import adminRoutes from "./admin/routes/admin.route";
import { AdminRepository } from "./admin/repositories/admin.repository";
import { AdminService } from "./admin/services/admin.service";
import { AdminController } from "./admin/controllers/admin.controller";
import donationRoutes from "./routes/donation.route";
import { DonationRepository } from "./repository/donation.repository";
import { DonationService } from "./services/donation.service";
import { DonationController } from "./controllers/donation.controller";
import { initRemindersCron } from "./utils/reminders.cron";
import { SocketService } from "./services/socket.service";
import { EmergencyRepository } from "./repository/emergency.repository";
import { EmergencyService } from "./services/emergency.service";
import { EmergencyController } from "./controllers/emergency.controller";

dotenv.config();

const app = express();
const server = http.createServer(app);
const socketService = new SocketService(server);

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`⬇️ Incoming Request`);
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers["content-type"]);
  console.log("Body:", req.body);
  next();
});

// Instantiate repositories
const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const adminRepository = new AdminRepository();
const donationRepository = new DonationRepository();
const emergencyRepository = new EmergencyRepository();

// Instantiate external services
const cloudinaryService = new CloudinaryService();

// Instantiate internal services
const otpService = new OtpService(otpRepository);
const authService = new AuthService(userRepository, otpRepository, otpService);
const userService = new UserService(userRepository, cloudinaryService);
const adminService = new AdminService(adminRepository);
const donationService = new DonationService(donationRepository, adminRepository);
const emergencyService = new EmergencyService(emergencyRepository, socketService, donationService, userRepository);

// Instantiate controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);
const adminController = new AdminController(adminService);
const donationController = new DonationController(donationService);
const emergencyController = new EmergencyController(emergencyService);

// Inject donation methods into admin controller for simplified routing (or keep separate)
// Given the existing structure, I'll add the methods to AdminController directly or use the donationController in routes.
// Let's use the donationController in routes for better separation.

// Routes
app.use("/api/auth", authRoutes(authController));
app.use("/api/users", userRoutes(userController, emergencyController));
app.use("/api/admin", adminRoutes(adminController, donationController, emergencyController));
app.use("/api/donations", donationRoutes(donationController));

// Health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running ✅" });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  initRemindersCron();
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});