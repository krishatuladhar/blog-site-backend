import express from "express";
import blogRoutes from "./blogRoute";
import authorRoutes from "./authorRoute";

const router = express.Router();
router.use("/blog", blogRoutes);
router.use("/author", authorRoutes);
export default router;
