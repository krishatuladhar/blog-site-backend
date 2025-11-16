import express from "express";
import blogRoute from "./blogRoute.js";

const router = express.Router();
router.use("/blogs", blogRoute);
export default router;
