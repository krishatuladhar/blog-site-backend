import "express";
import { User } from "./common";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
