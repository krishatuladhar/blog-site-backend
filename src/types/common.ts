import { RoleEnum } from "./userType";

export type User = {
  id: number;
  email: string;
  role: RoleEnum;
};

export type JWTPayload = User & {
  iat: number;
  exp: number;
};
