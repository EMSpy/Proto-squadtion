import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // O puedes poner { id: number; username: string }
    }
  }
}