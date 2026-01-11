import { User } from "../types/common";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
