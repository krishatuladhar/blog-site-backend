import express from "express";
import { createAuthor, loginAuthor } from "../controllers/authorController";
import { upload } from "../middlewares/upload";

const authRoutes = express.Router();

authRoutes.post("/", upload.single("profile"), createAuthor);
authRoutes.post("/login", loginAuthor);

export default authRoutes;
