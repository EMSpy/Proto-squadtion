import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import "dotenv/config"; 

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (socket as any).user = decoded; 
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};