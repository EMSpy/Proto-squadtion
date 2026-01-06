import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

export function authMiddleware(req: Request, res: Response, next:NextFunction) {
  const auth = req.headers.authorization;

  if (!auth) return res.sendStatus(401);

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    res.sendStatus(401);
  }
}
