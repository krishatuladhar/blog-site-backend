import express from "express";
import {
  updateAuthor,
  getAuthor,
  deleteAuthor,
} from "../controllers/authorController";
import { upload } from "../middlewares/upload";
import { authenticate } from "../middlewares/authenticate";

const authorRoutes = express.Router();
authorRoutes.get("/:id", authenticate, getAuthor);
authorRoutes.delete("/:id", authenticate, deleteAuthor);
authorRoutes.put("/:id", authenticate, upload.single("profile"), updateAuthor);

export default authorRoutes;
