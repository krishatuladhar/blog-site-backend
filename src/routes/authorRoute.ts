import express from "express";
import {
  updateAuthor,
  getAuthor,
  deleteAuthor,
} from "../controllers/authorController";
import { upload } from "../middlewares/upload";
import { protect } from "../middlewares/protect";


const authorRoutes = express.Router();
authorRoutes.get("/:id", protect, getAuthor);
authorRoutes.delete("/:id", protect, deleteAuthor);
authorRoutes.put("/:id", protect, upload.single("profile"), updateAuthor);

export default authorRoutes;
