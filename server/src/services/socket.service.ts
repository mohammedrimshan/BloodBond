import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyAccessToken } from "./jwt.service";
import { verifyAdminAccessToken } from "./admin.jwt.service";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
}

export class SocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ALLOWED_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupListeners();
  }

  private setupMiddleware() {
    this.io.use((socket: AuthenticatedSocket, next) => {
      let token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
      let isAdminToken = false;

      if (!token && socket.handshake.headers.cookie) {
        const cookies = socket.handshake.headers.cookie.split(";").reduce((acc: any, cookie: string) => {
          const [name, value] = cookie.trim().split("=");
          acc[name] = value;
          return acc;
        }, {});
        // Prefer admin token if present, otherwise use user token
        if (cookies["x-admin-access-token"]) {
          token = cookies["x-admin-access-token"];
          isAdminToken = true;
        } else {
          token = cookies["x-access-token"];
        }
      }

      console.log(`[Socket] Auth Token found: ${!!token} (isAdmin: ${isAdminToken})`);

      if (!token) {
        console.log(`[Socket] Rejecting connection: Token missing`);
        return next(new Error("Authentication error: Token missing"));
      }

      try {
        // Try user token first, then admin token
        let decoded: any;
        if (isAdminToken) {
          decoded = verifyAdminAccessToken(token);
        } else {
          try {
            decoded = verifyAccessToken(token);
          } catch {
            // Fallback: try admin token verification in case cookie name detection missed it
            decoded = verifyAdminAccessToken(token);
            isAdminToken = true;
          }
        }
        socket.userId = decoded.id || decoded.userId || decoded._id;
        socket.role = decoded.role || (isAdminToken ? "admin" : undefined);
        console.log(`[Socket] Authenticated User: ${socket.userId} (role: ${socket.role})`);
        next();
      } catch (err: any) {
        console.log(`[Socket] Rejecting connection: Invalid token (${err.message})`);
        next(new Error(`Authentication error: Invalid token (${err.message})`));
      }
    });
  }

  private setupListeners() {
    this.io.on("connection", (socket: AuthenticatedSocket) => {
      console.log(`🔌 Socket connected: ${socket.id} (User: ${socket.userId})`);

      if (socket.userId) {
        socket.join(socket.userId);
        console.log(`[Socket] User ${socket.userId} joined room ${socket.userId}`);
      }

      if (socket.role) {
        socket.join(socket.role);
        console.log(`[Socket] User joined role room: ${socket.role}`);
      }

      socket.on("disconnect", (reason) => {
        console.log(`🔌 Socket disconnected: ${socket.id} (User: ${socket.userId}, Reason: ${reason})`);
      });
    });
  }

  public broadcast(event: string, payload: any) {
    console.log(`[Socket] Broadcasting ${event} to ALL users`);
    this.io.emit(event, payload);
  }

  public sendToUser(userId: string, event: string, payload: any) {
    const roomId = userId.toString();
    console.log(`[Socket] Sending ${event} to user room: ${roomId}`);
    this.io.to(roomId).emit(event, payload);
  }

  public notifyEligibleUsers(userIds: string[], payload: any) {
    const rooms = userIds.map((id) => id.toString());
    console.log(`[Socket] Broadcasting to rooms:`, rooms);
    if (rooms.length > 0) {
      console.log(`📣 Broadcasting emergency to ${rooms.length} users with payload:`, payload);
      this.io.to(rooms).emit("emergency_blood_request", payload);
    } else {
      console.log(`[Socket] No eligible users to notify.`);
    }
  }
}
