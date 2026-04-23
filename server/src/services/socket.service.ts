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
      const tokenCandidates: { token: string; isAdmin: boolean }[] = [];

      // Check handshake auth/header first
      const handshakeToken = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
      if (handshakeToken) {
        tokenCandidates.push({ token: handshakeToken, isAdmin: false });
      }

      // Parse cookies and collect all available tokens
      if (socket.handshake.headers.cookie) {
        const cookies = socket.handshake.headers.cookie.split(";").reduce((acc: any, cookie: string) => {
          const [name, value] = cookie.trim().split("=");
          acc[name] = value;
          return acc;
        }, {});
        if (cookies["x-access-token"]) {
          tokenCandidates.push({ token: cookies["x-access-token"], isAdmin: false });
        }
        if (cookies["x-admin-access-token"]) {
          tokenCandidates.push({ token: cookies["x-admin-access-token"], isAdmin: true });
        }
      }

      if (tokenCandidates.length === 0) {
        console.log(`[Socket] Rejecting connection: Token missing`);
        return next(new Error("Authentication error: Token missing"));
      }

      // Try each token candidate until one succeeds
      let lastError: any = null;
      for (const candidate of tokenCandidates) {
        try {
          const decoded = candidate.isAdmin
            ? verifyAdminAccessToken(candidate.token) as any
            : verifyAccessToken(candidate.token) as any;
          
          socket.userId = decoded.id || decoded.userId || decoded._id;
          socket.role = decoded.role || (candidate.isAdmin ? "admin" : undefined);
          console.log(`[Socket] Authenticated User: ${socket.userId} (role: ${socket.role})`);
          return next();
        } catch (err: any) {
          lastError = err;
        }
      }

      console.log(`[Socket] Rejecting connection: Invalid token (${lastError?.message})`);
      next(new Error(`Authentication error: Invalid token (${lastError?.message})`));
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
    const room = this.io.sockets.adapter.rooms.get(roomId);
    const socketCount = room ? room.size : 0;
    console.log(`[Socket] Sending ${event} to user room: ${roomId} (${socketCount} sockets in room)`);
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
