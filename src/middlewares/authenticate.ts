import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/common";
import { RoleEnum } from "../types/authorTypes";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    req.user = {
      id: decoded.id,
      email: "decoded.email",
      role: RoleEnum.USER,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
