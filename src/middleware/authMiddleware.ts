import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    req.user = { id: payload.userId };

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
