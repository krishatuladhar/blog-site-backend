import express from "express";
import { upload } from "../middlewares/upload";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { deleteUserController, getUserController, updateUserController, upgradeRoleController } from "../controllers/userController";

const userRoutes = express.Router();
userRoutes.get("/:id", authenticate, getUserController);
userRoutes.delete("/:id", authenticate, authorize("author"), deleteUserController);
userRoutes.put(
  "/:id",
  authenticate,
  authorize("author"),
  upload.single("profile"),
  updateUserController
);
userRoutes.patch("/:id/upgrade-role", authenticate, upgradeRoleController)

export default userRoutes;
