import express from "express";
import { createUserController, loginUserController } from "../controllers/authController";
import { upload } from "../middlewares/upload";

const authRoutes = express.Router();

authRoutes.post("/", upload.single("profile"), createUserController);
authRoutes.post("/login", loginUserController);

export default authRoutes;
