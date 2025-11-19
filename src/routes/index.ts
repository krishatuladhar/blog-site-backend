import express from "express";
import blogRoutes from "./blogRoute";
import authorRoutes from "./authorRoute";
import authRoutes from "./authRoute";

const router = express.Router();
router.use("/blog", blogRoutes);
router.use("/author", authorRoutes);
router.use("/auth", authRoutes);
export default router;
