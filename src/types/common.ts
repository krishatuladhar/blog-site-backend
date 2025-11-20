import { Request } from "express";
import { RoleEnum } from "./authorTypes";

export type User = {
  id: number;
  email: string;
  role: RoleEnum;
};

export type JWTPayload = User & {
  iat: number;
  exp: number;
};
