import express from "express";
import blogRoutes from "./blogRoute";
import userRoutes from "./userRoute";
import authRoutes from "./authRoute";

const router = express.Router();
router.use("/blog", blogRoutes);
router.use("/user", userRoutes);
router.use("/auth", authRoutes);
export default router;
